import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScriptExecutor } from './ScriptExecutor';
import BackgroundLayer from './layers/BackgroundLayer';
import CharacterLayer from './layers/CharacterLayer';
import UILayer from './layers/UILayer';
import { DialogEvent } from './utils/DialogEvent';
import ShowMessage, { isShowMessageEvent } from './execution/ShowMessage';
import { isClearMessageEvent } from './execution/ClearMessage';
import { EventCommand } from './EventCommand';
import { isRequestSelectionEvent } from './execution/RequestSelection';
import RequestSelection, { RequestSelectionEvent } from './execution/RequestSelection';
import { 
	renderWithRetainedMessage,
	resolveNextScriptId 
} from './executor-utils/DialogExecutorUtils';

// System constants
const EMPTY_HANDLER = () => {};
const NAVIGATION_CONFIG = {
	BASE_PATH: '/labs/chat/'
};

// Types for script navigation and control
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
 * Main dialog system component that orchestrates character display, background,
 * and UI components. Processes dialog scripts and manages state transitions.
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
	
	/**
	 * Initializes or resets dialog state when script ID changes
	 * Effect: Clears message state and resets visibility with slight delay
	 */
	useEffect(() => {
		console.log(`ChatCore: Script ID set to ${currentScriptId}`);
		setCurrentMessage(null);
		setIsVisible(false);
		
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 100);
		
		return () => {
			clearTimeout(timer);
		};
	}, [currentScriptId]);
	
	/**
	 * Handles URL-based navigation between dialog scripts
	 * Effect: Updates current script ID when URL path changes
	 */
	useEffect(() => {
		const path = location.pathname;
		console.log(`ChatCore: Location changed to ${path}`);
		
		if (path.startsWith(NAVIGATION_CONFIG.BASE_PATH)) {
			const newScriptId = path.substring(NAVIGATION_CONFIG.BASE_PATH.length);
			if (newScriptId && newScriptId !== currentScriptId) {
				console.log(`ChatCore: Detected script ID change from URL: ${newScriptId}`);
				setCurrentScriptId(newScriptId);
			}
		}
	}, [location, currentScriptId]);
	
	/**
	 * Handler for background image changes from ScriptExecutor
	 * Input: Image path string or null to clear background
	 * Effect: Updates background state
	 */
	const handleBackgroundChange = useCallback((imagePath: string | null) => {
		console.log('ChatCore: Received background change:', imagePath);
		setBackground(imagePath);
	}, []);
	
	/**
	 * Processes message events from ScriptExecutor
	 * Input: DialogEvent or null to clear message
	 * Effect: Updates message state, visibility, and message history
	 */
	const handleMessageChange = useCallback((message: DialogEvent | null) => {
		console.log('ChatCore: Received message change:', message);
		
		if (currentMessage && isShowMessageEvent(currentMessage)) {
			setPreviousMessageComponent(
				<ShowMessage event={currentMessage} />
			);
		}
		
		if (message) {
			if (isShowMessageEvent(message)) {
				setMessageVisible(true);
			} else if (isClearMessageEvent(message)) {
				setMessageVisible(false);
			}
		} else {
			setMessageVisible(false);
		}
		
		setCurrentMessage(message);
		
		if (message) {
			setMessageHistory(prev => [...prev, message]);
		}
	}, [currentMessage]);
	
	/**
	 * Receives advance function from ScriptExecutor
	 * Input: Function to advance script to next event
	 * Effect: Updates advanceScript state
	 */
	const handleAdvanceReady = useCallback((advanceFunction: () => void) => {
		setAdvanceScript(() => advanceFunction);
	}, []);
	
	/**
	 * Handles script completion - manages transitions between scripts
	 * Input: FinishEvent object containing navigation data
	 * Effect: Navigates to next script or ends dialog
	 */
	const handleScriptComplete = useCallback((finishEvent: FinishEvent) => {
		console.log('ChatCore: Script completed with finish event:', finishEvent);
		
		if (!finishEvent || Object.keys(finishEvent).length === 0) {
			console.log('ChatCore: Empty finishEvent, doing nothing');
			return;
		}
		
		if (finishEvent.shouldClose) {
			console.log('ChatCore: Closing chat');
			onChatEnd?.();
			return;
		}
		
		if (finishEvent.nextScene && finishEvent.nextScript) {
			try {
				const storageKey = finishEvent.nextScript.match(/\{([^}]+)\}/)?.[1];
				let nextScript: string | null = null;
				
				if (storageKey) {
					nextScript = resolveNextScriptId(storageKey, finishEvent.nextScript);
				} else {
					nextScript = finishEvent.nextScript;
				}
				
				if (!nextScript || nextScript.includes('{')) {
					console.error(`ChatCore: Invalid script ID after resolution: "${nextScript}"`);
					return;
				}
				
				switch (finishEvent.nextScene) {
					case 'DIALOG':
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
			console.log('ChatCore: No next scene/script defined, calling onChatEnd');
			onChatEnd();
		}
	}, [onChatEnd, navigate]);
	
	/**
	 * Handles screen clicks to advance dialog
	 * Input: Mouse event
	 * Effect: Advances script or closes history view
	 */
	const handleContentClick = useCallback((e: React.MouseEvent) => {
		if (showHistory) {
			setShowHistory(false);
			return;
		}
		
		if (currentMessage && isRequestSelectionEvent(currentMessage)) {
			console.log('ChatCore: Selection event active, ignoring content click');
			return;
		}
		
		if (e.target === e.currentTarget || 
			(e.currentTarget as Node).contains(e.target as Node) && 
			!(e.target as Element).closest('.ui-element')) {
			console.log('ChatCore: Content clicked, advancing script');
			advanceScript?.();
		}
	}, [showHistory, advanceScript, currentMessage]);
	
	/**
	 * Toggles history panel visibility
	 * Input: Mouse event
	 * Effect: Updates showHistory state
	 */
	const handleHistoryClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		setShowHistory(!showHistory);
	}, [showHistory]);
	
	/**
	 * Processes selection events from choice dialogs
	 * Input: Selected value string
	 * Effect: Advances script if current event is a selection event
	 */
	const handleSelection = useCallback((value: string) => {
		console.log('ChatCore: Selection made:', value);
		
		if (currentMessage && isRequestSelectionEvent(currentMessage)) {
			console.log('ChatCore: Advancing after selection');
			advanceScript?.();
		}
	}, [currentMessage, advanceScript]);
	
	/**
	 * Renders appropriate component based on current message type
	 * Returns: React component for current message event
	 */
	const messageComponent = useMemo(() => {
		if (!currentMessage) return null;
		
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
	
	// Log message updates for debugging
	useEffect(() => {
		console.log('ChatCore: Current message updated:', currentMessage?.message);
	}, [currentMessage]);
	
	return (
		<div style={{ width: '100%', height: '100%', position: 'relative' }}>
			<BackgroundLayer backgroundImage={background} />
			<CharacterLayer />
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