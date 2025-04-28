import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventCommand } from './EventCommand';
import { isShowMessageEvent } from './execution/ShowMessage';
import ShowMessage from './execution/ShowMessage';
import { isClearMessageEvent } from './execution/ClearMessage';
import ClearMessage from './execution/ClearMessage';
import Wait from './execution/Wait';
import {DialogEvent} from "./utils/DialogEvent";
import RequestSelection, { isRequestSelectionEvent, RequestSelectionEvent } from './execution/RequestSelection';
import SetBackground, { SetBackgroundEvent } from './execution/SetBackground';
import RemoveBackground, { RemoveBackgroundEvent } from './execution/RemoveBackground';
import { renderWithRetainedMessage, isDuplicateEvent, processVariableSubstitution } from './executor-utils/DialogExecutorUtils';
import { DialogContainer, BackgroundLayer, BackgroundImage, ContentLayer, ControlPanel, ControlButton, ButtonIcon, ButtonLabel, HistoryPanel, HistoryEntry, HistoryName, HistoryText } from './executor-utils/executor-styled-div';

// Constants for configuration
const DIALOG_CONFIG = {
    NAVIGATION: {
        BASE_PATH: '/labs/chat/',
    },
    SPRITE_PATH: '/character-sprite/',
} as const;

export interface FinishEvent {
    nextScene: string;
    nextScript: string;
    shouldClose: boolean;
}

export interface DialogScript {
    events: DialogEvent[];
    finishEvent: FinishEvent;
}

interface Props {
    scriptId: string;
    onDialogEnd?: () => void;
}

export const DialogExecutor: React.FC<Props> = ({ scriptId, onDialogEnd }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentScript, setCurrentScript] = useState<DialogScript | null>(null);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [currentEvent, setCurrentEvent] = useState<DialogEvent | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<DialogEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [messageVisible, setMessageVisible] = useState(true); // Track if message should be visible
    const [selection, setSelection] = useState<string | null>(null);
    const onDialogEndRef = useRef(onDialogEnd);
    const navigate = useNavigate();
    
    // Update ref when prop changes
    useEffect(() => {
        onDialogEndRef.current = onDialogEnd;
    }, [onDialogEnd]);

    const handleFinishEvent = useCallback((finishEvent: FinishEvent) => {
        // Handle navigation based on finish event
        if (finishEvent.nextScene && finishEvent.nextScript) {
            // Process variable substitution in nextScript
            let nextScript = processVariableSubstitution(finishEvent.nextScript);
            
            switch (finishEvent.nextScene) {
                case 'DIALOG':
                    // Navigate to the next scene/script
                    navigate(`${DIALOG_CONFIG.NAVIGATION.BASE_PATH}${nextScript}`);
                    break;
                default:
                    break;
            }
        } else {
            // No next scene/script, end the dialog
            onDialogEndRef.current?.();
        }
    }, [navigate]);

    // Handler for advancing to the next message
    const advanceToNextMessage = useCallback(() => {
        if (!currentScript) return;
        
        // Move to the next event
        const nextIndex = currentEventIndex + 1;
        
        if (nextIndex < currentScript.events.length) {
            // Set the next event
            setCurrentEventIndex(nextIndex);
            const nextEvent = currentScript.events[nextIndex];
            setCurrentEvent(nextEvent);
            
            // Update message visibility based on event type
            if (isShowMessageEvent(nextEvent)) {
                setMessageVisible(true);
                
                // Check if this event is already in the history to prevent duplicates
                setHistory(prev => {
                    // Check if the event is already in the history
                    const isDuplicate = isDuplicateEvent(nextEvent, prev);
                    
                    // Only add to history if it's not a duplicate
                    return isDuplicate ? prev : [...prev, nextEvent];
                });
            } else if (isClearMessageEvent(nextEvent)) {
                setMessageVisible(false);
            }
        } else {
            // All events completed, handle finish event
            handleFinishEvent(currentScript.finishEvent);
        }
    }, [currentScript, currentEventIndex, handleFinishEvent]);

    // Handle selection from RequestSelection component
    const handleSelection = useCallback((value: string) => {
        setSelection(value);
        if (currentEvent && isRequestSelectionEvent(currentEvent)) {
            // Move to next event without clearing the message
            const nextIndex = currentEventIndex + 1;
            
            if (nextIndex < (currentScript?.events.length || 0)) {
                // Set the next event
                setCurrentEventIndex(nextIndex);
                const nextEvent = currentScript?.events[nextIndex];
                setCurrentEvent(nextEvent || null);
                
                // Update message visibility based on event type
                if (nextEvent && isShowMessageEvent(nextEvent)) {
                    setMessageVisible(true);
                    setHistory(prev => [...prev, nextEvent]);
                } else if (nextEvent && isClearMessageEvent(nextEvent)) {
                    setMessageVisible(false);
                }
                // For other event types, maintain current message visibility
            } else {
                // All events completed, handle finish event
                if (currentScript) {
                    handleFinishEvent(currentScript.finishEvent);
                }
            }
        }
    }, [currentEvent, currentEventIndex, currentScript, handleFinishEvent]);

    // Handle command execution based on the current event
    const commandExecution = useMemo(() => {
        if (!currentEvent) return null;
        
        switch (currentEvent.eventCommand) {
            case EventCommand.SHOW_MESSAGE:
                return <ShowMessage event={currentEvent} />;
            case EventCommand.CLEAR_MESSAGE:
                return <ClearMessage event={currentEvent} onComplete={advanceToNextMessage} />;
            case EventCommand.WAIT:
                // For WAIT command, retain the last message if it exists
                return renderWithRetainedMessage(
                    <Wait event={currentEvent} onComplete={advanceToNextMessage} />,
                    messageVisible
                );
            case EventCommand.REQUEST_SELECTION:
                // For REQUEST_SELECTION, retain the last message if it exists
                return renderWithRetainedMessage(
                    <RequestSelection
                        event={currentEvent as RequestSelectionEvent}
                        onSelect={handleSelection}
                    />,
                    messageVisible
                );
            case EventCommand.SET_BACKGROUND:
                return <SetBackground event={currentEvent as SetBackgroundEvent} onComplete={advanceToNextMessage} />;
            case EventCommand.REMOVE_BACKGROUND:
                return <RemoveBackground event={currentEvent as RemoveBackgroundEvent} onComplete={advanceToNextMessage} />;
            default:
                return null;
        }
    }, [currentEvent, advanceToNextMessage, handleSelection, messageVisible]);

    // Load the dialog script
    useEffect(() => {
        if (isLoading) return;

        const loadScript = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/dialog-script/dialog-${scriptId}.json`);
                const scriptData: DialogScript = await response.json();
                setCurrentScript(scriptData);
                setIsVisible(true);
                
                // Set the first event
                if (scriptData.events.length > 0) {
                    const firstEvent = scriptData.events[0];
                    setCurrentEvent(firstEvent);
                    
                    // Only add to history if it's a show message event
                    if (isShowMessageEvent(firstEvent)) {
                        setHistory([firstEvent]);
                    }
                } else {
                    // If no events, handle finish event immediately
                    handleFinishEvent(scriptData.finishEvent);
                }
            } catch (error) {
                console.error('Failed to load dialog script:', error);
                onDialogEndRef.current?.();
            } finally {
                setIsLoading(false);
            }
        };
        
        loadScript();
    }, [scriptId]); // Remove onDialogEnd from dependencies

    // Handle click on the content layer
    const handleContentClick = (e: React.MouseEvent) => {
        // If history is showing, close it instead of advancing
        if (showHistory) {
            setShowHistory(false);
            return;
        }
        
        // Don't advance if the current event is a RequestSelection event
        if (currentEvent && isRequestSelectionEvent(currentEvent)) {
            return;
        }
        
        // Only advance if we're not clicking on UI elements (menu buttons or icons)
        if (e.target === e.currentTarget || 
            (e.currentTarget as Node).contains(e.target as Node) && 
            !(e.target as Element).closest('.ui-element')) {
            advanceToNextMessage();
        }
    };
    
    // Handle button clicks
    const handleSaveClick = (e: React.MouseEvent) => { 
        e.stopPropagation(); // Prevent advancing dialog
        console.log("Save clicked");
    };
    
    const handleLoadClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent advancing dialog
        console.log("Load clicked");
    };
    
    const handleConfigClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent advancing dialog
        console.log("Config clicked");
    };
    
    const handleHistoryClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent advancing dialog
        setShowHistory(!showHistory);
        console.log("History clicked");
    };

    return (
        <DialogContainer>
            <BackgroundLayer $isVisible={isVisible} />
            <BackgroundImage id="dialog-background" />
            <ContentLayer onClick={handleContentClick}>
                {/* Command execution based on event type */}
                {commandExecution}

                <ControlPanel className="ui-element">
                    <ControlButton 
                        className="ui-element"
                        onClick={handleSaveClick}
                    >
                        <ButtonIcon>💾</ButtonIcon>
                        <ButtonLabel>Save</ButtonLabel>
                    </ControlButton>
                    <ControlButton 
                        className="ui-element"
                        onClick={handleLoadClick}
                    >
                        <ButtonIcon>📂</ButtonIcon>
                        <ButtonLabel>Load</ButtonLabel>
                    </ControlButton>
                    <ControlButton 
                        className="ui-element"
                        onClick={handleConfigClick}
                    >
                        <ButtonIcon>⚙️</ButtonIcon>
                        <ButtonLabel>Config</ButtonLabel>
                    </ControlButton>
                    <ControlButton 
                        className="ui-element"
                        onClick={handleHistoryClick}
                    >
                        <ButtonIcon>📜</ButtonIcon>
                        <ButtonLabel>Logs</ButtonLabel>
                    </ControlButton>
                </ControlPanel>

                <HistoryPanel 
                    $visible={showHistory} 
                    className="ui-element"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 style={{ color: '#a67c52', marginBottom: '20px', textAlign: 'center' }}>
                        Message History
                    </h2>
                    {history.map((event, index) => (
                        <HistoryEntry key={index}>
                            {event.unitRes && <HistoryName>{event.unitRes}</HistoryName>}
                            <HistoryText>{event.message}</HistoryText>
                        </HistoryEntry>
                    ))}
                </HistoryPanel>

                {currentEvent && isRequestSelectionEvent(currentEvent) && (
                    <RequestSelection
                        event={currentEvent}
                        onSelect={handleSelection}
                    />
                )}
            </ContentLayer>
        </DialogContainer>
    );
}; 