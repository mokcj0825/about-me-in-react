import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { EventCommand } from './EventCommand';
import { isShowMessageEvent } from './execution/ShowMessage';
import ShowMessage from './execution/ShowMessage';
import { isClearMessageEvent } from './execution/ClearMessage';
import ClearMessage from './execution/ClearMessage';
import { isWaitEvent } from './execution/Wait';
import Wait from './execution/Wait';
import {DialogEvent} from "./utils/DialogEvent";
import RequestSelection, { isRequestSelectionEvent, RequestSelectionEvent } from './execution/RequestSelection';
import SetBackground, { isSetBackgroundEvent, SetBackgroundEvent } from './execution/SetBackground';
import RemoveBackground, { isRemoveBackgroundEvent, RemoveBackgroundEvent } from './execution/RemoveBackground';

// Constants for configuration
const DIALOG_CONFIG = {
    TRANSITION_DURATION: 500,
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

// Styled components
const DialogContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'Crimson Text', serif;
`;

const BackgroundLayer = styled.div<{ $isVisible: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    opacity: ${props => props.$isVisible ? 1 : 0};
    transition: opacity ${DIALOG_CONFIG.TRANSITION_DURATION}ms ease-in-out;
    z-index: 1;
`;

const BackgroundImage = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0;
    z-index: 0;
`;

const ContentLayer = styled.div`
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer; /* Make the entire content layer clickable */
`;

// Control panel for menu buttons
const ControlPanel = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 10;
`;

const ControlButton = styled.button`
    background: #a67c52;
    color: white;
    border: 2px solid #8c5e2a;
    border-radius: 5px;
    width: 50px;
    height: 50px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    
    &:hover {
        background: #c89c72;
        transform: translateY(-2px);
    }
    
    &:active {
        transform: translateY(1px);
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
    }
`;

const ButtonIcon = styled.div`
    font-size: 20px;
    margin-bottom: 3px;
`;

const ButtonLabel = styled.div`
    font-size: 10px;
    text-transform: uppercase;
`;

// Dialog history panel
const HistoryPanel = styled.div<{ $visible: boolean }>`
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 70%;
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid #a67c52;
    border-radius: 10px;
    padding: 20px;
    color: white;
    z-index: 20;
    display: ${props => props.$visible ? 'block' : 'none'};
    overflow-y: auto;
`;

const HistoryEntry = styled.div`
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #a67c52;
`;

const HistoryName = styled.div`
    font-weight: bold;
    color: #a67c52;
    margin-bottom: 5px;
`;

const HistoryText = styled.div`
    font-size: 16px;
    line-height: 1.4;
`;

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
            let nextScript = finishEvent.nextScript;
            
            // Check if nextScript contains variables in the format {variableName}
            const variableRegex = /\{([^}]+)\}/g;
            const matches = nextScript.match(variableRegex);
            
            if (matches) {
                // Replace each variable with its value from localStorage
                matches.forEach(match => {
                    const variableName = match.replace(/[{}]/g, '');
                    const variableValue = localStorage.getItem(variableName) || '';
                    nextScript = nextScript.replace(match, variableValue);
                });
            }
            
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
                    const isDuplicate = prev.some(event => 
                        event === nextEvent || 
                        (isShowMessageEvent(event) && 
                         isShowMessageEvent(nextEvent) && 
                         event.message === nextEvent.message && 
                         event.unitRes === nextEvent.unitRes)
                    );
                    
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
        
        // Helper function to render with retained message if needed
        const renderWithRetainedMessage = (currentComponent: React.ReactNode) => {
            // If message is visible and we have history, show the last message
            if (messageVisible && history.length > 0) {
                const lastMessageEvent = history[history.length - 1];
                if (isShowMessageEvent(lastMessageEvent)) {
                    return (
                        <>
                            <ShowMessage event={lastMessageEvent} />
                            {currentComponent}
                        </>
                    );
                }
            }
            return currentComponent;
        };
        
        switch (currentEvent.eventCommand) {
            case EventCommand.SHOW_MESSAGE:
                return <ShowMessage event={currentEvent} />;
            case EventCommand.CLEAR_MESSAGE:
                return <ClearMessage event={currentEvent} onComplete={advanceToNextMessage} />;
            case EventCommand.WAIT:
                // For WAIT command, retain the last message if it exists
                return renderWithRetainedMessage(
                    <Wait event={currentEvent} onComplete={advanceToNextMessage} />
                );
            case EventCommand.REQUEST_SELECTION:
                // For REQUEST_SELECTION, retain the last message if it exists
                return renderWithRetainedMessage(
                    <RequestSelection
                        event={currentEvent as RequestSelectionEvent}
                        onSelect={handleSelection}
                    />
                );
            case EventCommand.SET_BACKGROUND:
                return <SetBackground event={currentEvent as SetBackgroundEvent} onComplete={advanceToNextMessage} />;
            case EventCommand.REMOVE_BACKGROUND:
                return <RemoveBackground event={currentEvent as RemoveBackgroundEvent} onComplete={advanceToNextMessage} />;
            default:
                return null;
        }
    }, [currentEvent, advanceToNextMessage, history, messageVisible, handleSelection]);

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
        // Add save functionality here
    };
    
    const handleLoadClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent advancing dialog
        console.log("Load clicked");
        // Add load functionality here
    };
    
    const handleConfigClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent advancing dialog
        console.log("Config clicked");
        // Add configuration functionality here
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

                {/* Control panel */}
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

                {/* History panel */}
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