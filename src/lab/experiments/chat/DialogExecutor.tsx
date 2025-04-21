import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Constants for configuration
const DIALOG_CONFIG = {
    TRANSITION_DURATION: 500,
    NAVIGATION: {
        BASE_PATH: '/labs/chat/',
    },
} as const;

// Types for the dialog system
export enum MessagePosition {
    TOP = 'TOP',
    MIDDLE = 'MIDDLE',
    BOTTOM = 'BOTTOM'
}

export interface DialogEvent {
    eventCommand: string;
    unitRes: string | null;
    position: MessagePosition;
    message: string;
}

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
`;

const BackgroundLayer = styled.div<{ $isVisible: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    opacity: ${props => props.$isVisible ? 1 : 0};
    transition: opacity ${DIALOG_CONFIG.TRANSITION_DURATION}ms ease-in-out;
    z-index: 1;
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
`;

const MessageContainer = styled.div<{ $position: MessagePosition }>`
    max-width: 80%;
    margin: 20px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: white;
    position: absolute;
    cursor: pointer;
    ${props => {
        switch (props.$position) {
            case MessagePosition.TOP:
                return 'top: 20%;';
            case MessagePosition.MIDDLE:
                return 'top: 50%; transform: translateY(-50%);';
            case MessagePosition.BOTTOM:
                return 'bottom: 20%;';
            default:
                return 'top: 50%; transform: translateY(-50%);';
        }
    }}
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
    const navigate = useNavigate();

    // Load the dialog script
    useEffect(() => {
        const loadScript = async () => {
            try {
                const response = await fetch(`/dialog-script/dialog-${scriptId}.json`);
                const scriptData: DialogScript = await response.json();
                setCurrentScript(scriptData);
                setIsVisible(true);
                
                // Set the first event
                if (scriptData.events.length > 0) {
                    setCurrentEvent(scriptData.events[0]);
                } else {
                    // If no events, handle finish event immediately
                    handleFinishEvent(scriptData.finishEvent);
                }
            } catch (error) {
                console.error('Failed to load dialog script:', error);
                onDialogEnd?.();
            }
        };
        
        loadScript();
    }, [scriptId, onDialogEnd]);

    const handleMessageClick = () => {
        if (!currentScript) return;
        
        // Move to the next event
        const nextIndex = currentEventIndex + 1;
        
        if (nextIndex < currentScript.events.length) {
            // Set the next event
            setCurrentEventIndex(nextIndex);
            setCurrentEvent(currentScript.events[nextIndex]);
        } else {
            // All events completed, handle finish event
            handleFinishEvent(currentScript.finishEvent);
        }
    };

    const handleFinishEvent = (finishEvent: FinishEvent) => {
        // Handle navigation based on finish event
        if (finishEvent.nextScene && finishEvent.nextScript) {
            switch (finishEvent.nextScene) {
                case 'DIALOG':
                    // Navigate to the next scene/script
                    (`${DIALOG_CONFIG.NAVIGATION.BASE_PATH}${finishEvent.nextScript}`);
                    break;
                default:
                    break;
            }
        } else {
            // No next scene/script, end the dialog
            onDialogEnd?.();
        }
    };

    return (
        <DialogContainer>
            <BackgroundLayer $isVisible={isVisible} />
            <ContentLayer>
                {currentEvent && (
                    <MessageContainer 
                        $position={currentEvent.position} 
                        onClick={handleMessageClick}
                    >
                        {currentEvent.unitRes && <strong>{currentEvent.unitRes}: </strong>}
                        {currentEvent.message}
                    </MessageContainer>
                )}
            </ContentLayer>
        </DialogContainer>
    );
}; 