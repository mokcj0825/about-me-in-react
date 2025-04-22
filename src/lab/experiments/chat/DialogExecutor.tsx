import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Constants for configuration
const DIALOG_CONFIG = {
    TRANSITION_DURATION: 500,
    NAVIGATION: {
        BASE_PATH: '/labs/chat/',
    },
    SPRITE_PATH: '/character-sprite/',
} as const;

// Types for the dialog system
export enum SpritePosition {
    LEFT = 'LEFT',
    MIDDLE = 'MIDDLE',
    RIGHT = 'RIGHT'
}

export interface DialogEvent {
    eventCommand: string;
    unitRes: string | null;
    position: SpritePosition;
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
    font-family: 'Crimson Text', serif;
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

// Character Sprite Container - positioned based on SpritePosition
const CharacterSprite = styled.div<{ $position: SpritePosition; $active: boolean }>`
    position: absolute;
    bottom: 240px; // Position above the text box
    opacity: ${props => props.$active ? 1 : 0.7};
    filter: ${props => props.$active ? 'none' : 'grayscale(30%) brightness(80%)'};
    transform-origin: bottom center;
    z-index: ${props => props.$active ? 5 : 3};
    
    ${props => {
        switch (props.$position) {
            case SpritePosition.LEFT:
                return 'left: 15%; transform: translateX(-50%);';
            case SpritePosition.MIDDLE:
                return 'left: 50%; transform: translateX(-50%);';
            case SpritePosition.RIGHT:
                return 'left: 85%; transform: translateX(-50%);';
            default:
                return 'left: 50%; transform: translateX(-50%);';
        }
    }}
`;

const SpriteImage = styled.img`
    max-height: 500px;
    max-width: 300px;
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
`;

// Keep the placeholder for fallback
const SpriteImagePlaceholder = styled.div`
    width: 300px;
    height: 400px;
    background: linear-gradient(135deg, rgba(166, 124, 82, 0.5), rgba(166, 124, 82, 0.2));
    border: 2px solid #a67c52;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

// Visual Novel style text box at the bottom
const VisualNovelTextBox = styled.div`
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    min-height: 180px;
    background: rgba(0, 0, 0, 0.7);
    border: 2px solid #a67c52;
    border-radius: 10px;
    padding: 20px;
    color: white;
    z-index: 10;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
`;

// Character name box
const NameBox = styled.div`
    position: absolute;
    top: -22px;
    left: 20px;
    background: #a67c52;
    padding: 5px 15px;
    border-radius: 5px 5px 0 0;
    color: white;
    font-weight: bold;
    font-size: 18px;
    box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.3);
`;

// Message text
const MessageText = styled.div`
    font-size: 20px;
    line-height: 1.5;
    letter-spacing: 0.5px;
    margin-top: 5px;
`;

// Continue indicator
const ContinueIndicator = styled.div`
    position: absolute;
    bottom: 15px;
    right: 20px;
    width: 20px;
    height: 20px;
    border-right: 3px solid white;
    border-bottom: 3px solid white;
    transform: rotate(-45deg);
    animation: pulse 1.5s infinite;

    @keyframes pulse {
        0% {
            opacity: 0.5;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.5;
        }
    }
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

// Progress indicator
const ProgressIndicator = styled.div`
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 14px;
    color: #a67c52;
    background: rgba(0, 0, 0, 0.7);
    padding: 5px 10px;
    border-radius: 20px;
    border: 1px solid #a67c52;
    z-index: 10;
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
    const navigate = useNavigate();

    // Function to get sprite image path based on unitRes
    const getSpriteImagePath = (unitRes: string | null): string | null => {
        if (!unitRes) return null;
        
        // Use the unitRes as the filename with .png extension
        return `${DIALOG_CONFIG.SPRITE_PATH}${unitRes.toLowerCase()}.png`;
    };

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
                    setHistory([scriptData.events[0]]);
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
            const nextEvent = currentScript.events[nextIndex];
            setCurrentEvent(nextEvent);
            
            // Add to history
            setHistory(prev => [...prev, nextEvent]);
        } else {
            // All events completed, handle finish event
            handleFinishEvent(currentScript.finishEvent);
        }
    };

    // Handle click on the content layer
    const handleContentClick = (e: React.MouseEvent) => {
        // If history is showing, close it instead of advancing
        if (showHistory) {
            setShowHistory(false);
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
                {/* Character sprite based on position */}
                {currentEvent && currentEvent.unitRes && getSpriteImagePath(currentEvent.unitRes) && (
                    <CharacterSprite 
                        $position={currentEvent.position}
                        $active={true}
                    >
                        <SpriteImage 
                            src={getSpriteImagePath(currentEvent.unitRes) || ''} 
                            alt={currentEvent.unitRes}
                        />
                    </CharacterSprite>
                )}

                {/* Visual novel style text box */}
                {currentEvent && (
                    <VisualNovelTextBox className="ui-element">
                        {currentEvent.unitRes && <NameBox>{currentEvent.unitRes}</NameBox>}
                        <MessageText>{currentEvent.message}</MessageText>
                        <ContinueIndicator />
                    </VisualNovelTextBox>
                )}

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

                {/* Progress indicator */}
                {currentScript && (
                    <ProgressIndicator className="ui-element">
                        {currentEventIndex + 1} / {currentScript.events.length}
                    </ProgressIndicator>
                )}

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
            </ContentLayer>
        </DialogContainer>
    );
}; 