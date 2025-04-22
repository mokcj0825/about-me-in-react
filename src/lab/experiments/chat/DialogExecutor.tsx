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
    cursor: pointer; /* Make the entire content layer clickable */
`;

const MessageContainer = styled.div<{ $position: MessagePosition }>`
    max-width: 80%;
    margin: 20px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: white;
    position: absolute;
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

// Menu bar at the bottom
const MenuBar = styled.div`
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 10px;
    z-index: 10;
`;

const MenuButton = styled.button`
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
    }
    
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
    }
`;

// Top-right menu icon
const TopMenuBar = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
`;

const MenuIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
    }
    
    &::before, &::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 2px;
        background-color: white;
    }
    
    &::before {
        transform: rotate(90deg);
    }
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

    // Handler for advancing to the next message
    const advanceToNextMessage = () => {
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

    // Handle click on the content layer
    const handleContentClick = (e: React.MouseEvent) => {
        // Only advance if we're not clicking on UI elements (menu buttons or icons)
        if (e.target === e.currentTarget || 
            (e.currentTarget as Node).contains(e.target as Node) && 
            !(e.target as Element).closest('.ui-element')) {
            advanceToNextMessage();
        }
    };

    // Handle top menu icon click
    const handleMenuIconClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent advancing dialog
        setShowMenu(!showMenu);
        console.log("Menu icon clicked");
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
    
    const handleLogsClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent advancing dialog
        console.log("Logs clicked");
        // Add logs functionality here
    };

    const handleFinishEvent = (finishEvent: FinishEvent) => {
        // Handle navigation based on finish event
        if (finishEvent.nextScene && finishEvent.nextScript) {
            switch (finishEvent.nextScene) {
                case 'DIALOG':
                    // Navigate to the next scene/script
                    navigate(`${DIALOG_CONFIG.NAVIGATION.BASE_PATH}${finishEvent.nextScript}`);
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
            <ContentLayer onClick={handleContentClick}>
                {currentEvent && (
                    <MessageContainer $position={currentEvent.position}>
                        {currentEvent.unitRes && <strong>{currentEvent.unitRes}: </strong>}
                        {currentEvent.message}
                    </MessageContainer>
                )}

                {/* Menu bar with buttons */}
                <MenuBar className="ui-element">
                    <MenuButton 
                        className="ui-element"
                        onClick={handleSaveClick}
                    >
                        Save
                    </MenuButton>
                    <MenuButton 
                        className="ui-element"
                        onClick={handleLoadClick}
                    >
                        Load
                    </MenuButton>
                    <MenuButton 
                        className="ui-element"
                        onClick={handleConfigClick}
                    >
                        Config
                    </MenuButton>
                    <MenuButton 
                        className="ui-element"
                        onClick={handleLogsClick}
                    >
                        Logs
                    </MenuButton>
                </MenuBar>

                {/* Top menu icon */}
                <TopMenuBar className="ui-element">
                    <MenuIcon 
                        onClick={handleMenuIconClick} 
                        className="ui-element"
                    />
                </TopMenuBar>
            </ContentLayer>
        </DialogContainer>
    );
}; 