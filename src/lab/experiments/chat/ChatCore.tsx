import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScriptExecutor } from './ScriptExecutor';
import BackgroundLayer from './layers/BackgroundLayer';
import CharacterLayer from './layers/CharacterLayer';
import UILayer from './layers/UILayer';
import { DialogEvent } from './utils/DialogEvent';
import ShowMessage, { isShowMessageEvent } from './execution/ShowMessage';
import ClearMessage, { isClearMessageEvent } from './execution/ClearMessage';
import { EventCommand } from './EventCommand';
import { isRequestSelectionEvent } from './execution/RequestSelection';
import RequestSelection, { RequestSelectionEvent } from './execution/RequestSelection';
import { 
	renderWithRetainedMessage, 
	processVariableSubstitution, 
	resolveNextScriptId 
} from './executor-utils/DialogExecutorUtils';

// Constants
const EMPTY_HANDLER = () => {};
const NAVIGATION_CONFIG = {
	BASE_PATH: '/labs/chat/'
};

interface FinishEvent {
	nextScene?: string;
	nextScript?: string;
	shouldClose?: boolean;
	[key: string]: any; // Allow for additional properties
}

interface Props {
	dialogScriptId: string;
	onChatEnd?: () => void;
}

/**
 * ChatCore component
 * 
 * Main entry point for the chat/dialogue system
 * Manages three separate layers:
 * - BackgroundLayer: Displays background images
 * - CharacterLayer: Displays character sprites
 * - UILayer: Displays UI elements and dialogs
 * 
 * Uses ScriptExecutor to process scripts and update layers through state changes
 */
export const ChatCore: React.FC<Props> = ({
	dialogScriptId,
	onChatEnd
}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [isVisible, setIsVisible] = useState(false);
	const [currentScriptId, setCurrentScriptId] = useState(dialogScriptId);
	const [background, setBackground] = useState<string | null>(null);
	const [currentMessage, setCurrentMessage] = useState<DialogEvent | null>(null);
	const [messageHistory, setMessageHistory] = useState<DialogEvent[]>([]);
	const [showHistory, setShowHistory] = useState(false);
	const [advanceScript, setAdvanceScript] = useState<(() => void) | null>(null);
	const [messageVisible, setMessageVisible] = useState(true);
	const [previousMessageComponent, setPreviousMessageComponent] = useState<React.ReactNode | null>(null);
	
	// Update currentScriptId when dialogScriptId prop changes or finishEvent loads new script
	useEffect(() => {
		console.log(`ChatCore: Script ID set to ${currentScriptId}`);
		
		// Clear message state when script ID changes
		setCurrentMessage(null);
		setIsVisible(false);
		
		// Initialize new dialog after a short delay to ensure clean state
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 100);
		
		return () => {
			clearTimeout(timer);
		};
	}, [currentScriptId]);
	
	// Handle URL changes from within the component
	useEffect(() => {
		const path = location.pathname;
		console.log(`ChatCore: Location changed to ${path}`);
		
		// Extract script ID from path
		if (path.startsWith(NAVIGATION_CONFIG.BASE_PATH)) {
			const newScriptId = path.substring(NAVIGATION_CONFIG.BASE_PATH.length);
			if (newScriptId && newScriptId !== currentScriptId) {
				console.log(`ChatCore: Detected script ID change from URL: ${newScriptId}`);
				setCurrentScriptId(newScriptId);
			}
		}
	}, [location, currentScriptId]);
	
	// Handle background changes from ScriptExecutor
	const handleBackgroundChange = useCallback((imagePath: string | null) => {
		console.log('ChatCore: Received background change:', imagePath);
		setBackground(imagePath);
	}, []);
	
	// Handle message changes from ScriptExecutor
	const handleMessageChange = useCallback((message: DialogEvent | null) => {
		console.log('ChatCore: Received message change:', message);
		
		// Save current message component before updating
		if (currentMessage && isShowMessageEvent(currentMessage)) {
			setPreviousMessageComponent(
				<ShowMessage event={currentMessage} />
			);
		}
		
		// Update message visibility based on event type
		if (message) {
			if (isShowMessageEvent(message)) {
				setMessageVisible(true);
			} else if (isClearMessageEvent(message)) {
				setMessageVisible(false);
			}
			// For other event types, maintain current visibility
		} else {
			// null message indicates a CLEAR_MESSAGE
			setMessageVisible(false);
		}
		
		setCurrentMessage(message);
		
		// Add message to history if it's a new message (not null)
		if (message) {
			setMessageHistory(prev => [...prev, message]);
		}
	}, [currentMessage]);
	
	// Get the advance function from ScriptExecutor
	const handleAdvanceReady = useCallback((advanceFunction: () => void) => {
		setAdvanceScript(() => advanceFunction);
	}, []);
	
	// Handle script completion
	const handleScriptComplete = useCallback((finishEvent: FinishEvent) => {
		console.log('ChatCore: Script completed with finish event:', finishEvent);
		
		// If finishEvent is empty or not defined, just do nothing
		if (!finishEvent || Object.keys(finishEvent).length === 0) {
			console.log('ChatCore: Empty finishEvent, doing nothing');
			return;
		}
		
		// Handle shouldClose flag if present
		if (finishEvent.shouldClose) {
			// Close the dialog/chat
			console.log('ChatCore: Closing chat');
			onChatEnd?.();
			return;
		}
		
		// Handle navigation if nextScene and nextScript are provided
		if (finishEvent.nextScene && finishEvent.nextScript) {
			try {
				// Get the storageKey from the nextScript if it contains a variable reference
				const storageKey = finishEvent.nextScript.match(/\{([^}]+)\}/)?.[1];
				
				// Try to resolve the nextScriptId based on the storageKey or directly
				let nextScript: string | null = null;
				
				if (storageKey) {
					// If the nextScript is a variable reference, use resolveNextScriptId
					nextScript = resolveNextScriptId(storageKey, finishEvent.nextScript);
				} else {
					// Otherwise, just use the nextScript directly
					nextScript = finishEvent.nextScript;
				}
				
				// Verify we have a valid script ID after resolution
				if (!nextScript || nextScript.includes('{')) {
					console.error(`ChatCore: Invalid script ID after resolution: "${nextScript}"`);
					return;
				}
				
				switch (finishEvent.nextScene) {
					case 'DIALOG':
						// Load the next script directly
						console.log(`ChatCore: Loading next script: ${nextScript}`);
						navigate(`${NAVIGATION_CONFIG.BASE_PATH}${nextScript}`);
						break;
						
					default:
						console.log(`ChatCore: Unknown next scene: ${finishEvent.nextScene}`);
						break;
				}
			} catch (error) {
				console.error('ChatCore: Error during script transition:', error);
			}
		} else if (onChatEnd) {
			// If there's no next script but we have an onChatEnd handler, call it
			console.log('ChatCore: No next scene/script defined, calling onChatEnd');
			onChatEnd();
		}
	}, [onChatEnd, navigate]);
	
	// Handle click on content to advance dialog
	const handleContentClick = useCallback((e: React.MouseEvent) => {
		// If history is showing, close it instead of advancing
		if (showHistory) {
			setShowHistory(false);
			return;
		}
		
		// Don't advance if we have a selection event
		if (currentMessage && isRequestSelectionEvent(currentMessage)) {
			console.log('ChatCore: Selection event active, ignoring content click');
			return;
		}
		
		// Only advance if we're not clicking on UI elements
		if (e.target === e.currentTarget || 
			(e.currentTarget as Node).contains(e.target as Node) && 
			!(e.target as Element).closest('.ui-element')) {
			console.log('ChatCore: Content clicked, advancing script');
			advanceScript?.();
		}
	}, [showHistory, advanceScript, currentMessage]);
	
	// Handle button clicks
	const handleHistoryClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent advancing dialog
		setShowHistory(!showHistory);
	}, [showHistory]);
	
	// Handle selection from RequestSelection component
	const handleSelection = useCallback((value: string) => {
		console.log('ChatCore: Selection made:', value);
		
		// If the current event is a selection event, advance the script
		if (currentMessage && isRequestSelectionEvent(currentMessage)) {
			console.log('ChatCore: Advancing after selection');
			advanceScript?.();
		}
	}, [currentMessage, advanceScript]);
	
	// Create appropriate component for the current message
	const messageComponent = useMemo(() => {
		if (!currentMessage) return null;
		
		// Create component based on event type
		switch (currentMessage.eventCommand) {
			case EventCommand.SHOW_MESSAGE:
				return <ShowMessage event={currentMessage} />;
				
			case EventCommand.REQUEST_SELECTION:
				return renderWithRetainedMessage(
					messageVisible,
					previousMessageComponent,
					<RequestSelection 
						event={currentMessage as RequestSelectionEvent}
						onSelect={handleSelection}
					/>
				);
				
			default:
				return null;
		}
	}, [currentMessage, handleSelection, messageVisible, previousMessageComponent]);
	
	useEffect(() => {
		console.log('ChatCore: Current message updated:', currentMessage?.message);
	}, [currentMessage]);
	
	return (
		<div style={{ width: '100%', height: '100%', position: 'relative' }}>
			{/* Background Layer - state managed by ChatCore */}
			<BackgroundLayer backgroundImage={background} />
			
			{/* Character Layer - will receive state from ChatCore later */}
			<CharacterLayer />
			
			{/* UI Layer - receives message state from ChatCore */}
			<UILayer 
				currentEvent={currentMessage}
				messageHistory={messageHistory}
				showHistory={showHistory}
				handleContentClick={handleContentClick}
				handleSaveClick={EMPTY_HANDLER}
				handleLoadClick={EMPTY_HANDLER}
				handleConfigClick={EMPTY_HANDLER}
				handleHistoryClick={handleHistoryClick}
				handleSelection={handleSelection}
				commandExecution={messageComponent}
			/>
			
			{/* Script Executor - processes scripts and emits events */}
			{isVisible && (
				<ScriptExecutor 
					scriptId={currentScriptId}
					onBackgroundChange={handleBackgroundChange}
					onMessageChange={handleMessageChange}
					onAdvanceReady={handleAdvanceReady}
					onScriptComplete={handleScriptComplete}
				/>
			)}
		</div>
	);
};