import React, { useEffect, useState, useCallback } from 'react';
import { EventCommand } from './EventCommand';
import { DialogEvent } from './utils/DialogEvent';
import { characterService } from './services/CharacterService';
import { getCharacterSprite, CharacterPosition } from './execution/ShowCharacter';

/**
 * Types for script structure and execution
 */
interface FinishEvent {
    nextScene?: string;
    nextScript?: string;
    shouldClose?: boolean;
    [key: string]: any; // Allow for additional properties
}

interface Script {
    events: DialogEvent[];
    finishEvent: FinishEvent;
}

interface Props {
    scriptId: string;
    onBackgroundChange?: (imagePath: string | null) => void;
    onMessageChange?: (message: DialogEvent | null) => void;
    onAdvanceReady?: (advanceFunction: () => void) => void;
    onScriptComplete?: (finishEvent: FinishEvent) => void;
}

/**
 * ScriptExecutor component
 * 
 * Loads and executes dialog scripts, processing events sequentially.
 * Emits appropriate events to parent components for UI updates.
 * Handles navigation between scripts through finish events.
 */
export const ScriptExecutor: React.FC<Props> = ({ 
    scriptId,
    onBackgroundChange,
    onMessageChange,
    onAdvanceReady,
    onScriptComplete
}) => {
    const [script, setScript] = useState<Script | null>(null);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [currentEvent, setCurrentEvent] = useState<DialogEvent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    /**
     * Process current event when it changes
     */
    useEffect(() => {
        console.log('ScriptExecutor: Current event updated:', 
            currentEvent ? `${currentEvent.eventCommand} - ${JSON.stringify(currentEvent)}` : 'null');
        
        if (currentEvent) {
            processEvent();
        }
    }, [currentEvent]);

    /**
     * Load script data from JSON file
     * Effect: Fetches script and initializes with first event
     */
    useEffect(() => {
        if (scriptLoaded || isLoading) return;

        const loadScript = async () => {
            try {
                setIsLoading(true);
                console.log(`Loading script: ${scriptId}`);
                
                const response = await fetch(`/dialog-script/${scriptId}.json`);
                
                if (!response.ok) {
                    throw new Error(`Failed to load script: ${response.status}`);
                }
                
                const scriptData: Script = await response.json();
                console.log('ScriptExecutor: Script loaded:', scriptData);
                
                if (!scriptData.finishEvent) {
                    scriptData.finishEvent = {};
                }
                
                setScript(scriptData);
                setScriptLoaded(true);
                
                if (scriptData.events.length > 0) {
                    console.log('ScriptExecutor: Setting first event:', scriptData.events[0]);
                    setCurrentEvent(scriptData.events[0]);
                } else {
                    handleScriptComplete(scriptData.finishEvent);
                }
                
            } catch (error) {
                console.error('Script loading error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadScript();
    }, [scriptId, scriptLoaded]);

    /**
     * Reset state when script ID changes
     */
    useEffect(() => {
        setScriptLoaded(false);
        setCurrentEventIndex(0);
        setCurrentEvent(null);
        setScript(null);
    }, [scriptId]);

    /**
     * Process the current event based on its type
     * Effect: Emits appropriate callbacks and may advance to next event
     */
    const processEvent = useCallback(() => {
        if (!currentEvent || !script) {
            console.log('ScriptExecutor: No current event or script to process');
            return;
        }

        console.log(`ScriptExecutor: Processing event: ${currentEvent.eventCommand}`, currentEvent);
        
        switch (currentEvent.eventCommand) {
            case EventCommand.SET_BACKGROUND:
                if ('imagePath' in currentEvent && currentEvent.imagePath) {
                    console.log('ScriptExecutor: Emitting background change:', currentEvent.imagePath);
                    onBackgroundChange?.(currentEvent.imagePath);
                }
                advanceToNextEvent();
                break;
                
            case EventCommand.REMOVE_BACKGROUND:
                console.log('ScriptExecutor: Emitting background removal');
                onBackgroundChange?.(null);
                advanceToNextEvent();
                break;

            case EventCommand.SHOW_CHARACTER:
                const characterInfo = getCharacterSprite(currentEvent);
                
                if (characterInfo) {
                    console.log(`ScriptExecutor: Showing character at ${characterInfo.position} with sprite ${characterInfo.sprite}`);
                    characterService.showCharacter(characterInfo.position, characterInfo.sprite);
                } else {
                    console.log('ScriptExecutor: Invalid SHOW_CHARACTER event - missing position or sprite info:', currentEvent);
                }
                advanceToNextEvent();
                break;
                
            case EventCommand.HIDE_CHARACTER:
                if ('position' in currentEvent) {
                    const { position } = currentEvent;
                    console.log(`ScriptExecutor: Hiding character at ${position}`);
                    characterService.hideCharacter(position as CharacterPosition);
                } else {
                    console.log('ScriptExecutor: Invalid HIDE_CHARACTER event:', currentEvent);
                }
                advanceToNextEvent();
                break;

            case EventCommand.SHOW_MESSAGE:
                console.log('ScriptExecutor: Emitting message event:', currentEvent);
                onMessageChange?.(currentEvent);
                return; // Wait for user click
                
            case EventCommand.CLEAR_MESSAGE:
                console.log('ScriptExecutor: Emitting clear message');
                onMessageChange?.(null);
                advanceToNextEvent();
                break;
                
            case EventCommand.REQUEST_SELECTION:
                console.log('ScriptExecutor: Processing selection request:', currentEvent);
                onMessageChange?.(currentEvent);
                return; // Wait for user selection
                
            case EventCommand.WAIT:
                console.log('ScriptExecutor: Processing wait event:', currentEvent);
                if ('time' in currentEvent && typeof currentEvent.time === 'number') {
                    setTimeout(() => {
                        console.log(`ScriptExecutor: Wait of ${currentEvent.time}ms completed`);
                        advanceToNextEvent();
                    }, currentEvent.time);
                } else {
                    console.log('ScriptExecutor: Invalid wait time, auto-advancing');
                    advanceToNextEvent();
                }
                break;
                
            default:
                console.log('ScriptExecutor: Unknown command, auto-advancing:', currentEvent.eventCommand);
                advanceToNextEvent();
                break;
        }
    }, [currentEvent, script, onBackgroundChange, onMessageChange]);

    /**
     * Notifies parent component when script is complete
     * Input: FinishEvent object with navigation details
     * Effect: Triggers callback to parent
     */
    const handleScriptComplete = useCallback((finishEvent: FinishEvent) => {
        console.log('ScriptExecutor: Script completed with finish event:', finishEvent);
        onScriptComplete?.(finishEvent);
    }, [onScriptComplete]);

    /**
     * Advances to the next event in the script
     * Effect: Updates current event or completes script
     */
    const advanceToNextEvent = useCallback(() => {
        if (!script || currentEventIndex === undefined) return;
        
        const nextIndex = currentEventIndex + 1;
        console.log(`ScriptExecutor: Advancing to next event ${nextIndex}/${script.events.length}`);
        
        if (nextIndex < script.events.length) {
            setCurrentEventIndex(nextIndex);
            setCurrentEvent(script.events[nextIndex]);
        } else {
            console.log('ScriptExecutor: No more events, handling finish event');
            handleScriptComplete(script.finishEvent);
        }
    }, [currentEventIndex, script, handleScriptComplete]);

    /**
     * Handles manual advancement from user interaction
     * Effect: Advances eligible events (messages, selections)
     */
    const advanceScript = useCallback(() => {
        if (!script || !currentEvent) {
            console.log('ScriptExecutor: Cannot advance, no script or current event');
            return;
        }
        
        console.log('ScriptExecutor: Manual advance triggered for:', 
            currentEvent.eventCommand);

        switch (currentEvent.eventCommand) {
            case EventCommand.SHOW_MESSAGE:
            case EventCommand.REQUEST_SELECTION:
                advanceToNextEvent();
                break;
            default:
                console.log('ScriptExecutor: Not an advanceable event, ignoring advance');
                break;
        }
    }, [currentEvent, advanceToNextEvent]);

    /**
     * Provides the advance function to parent component
     */
    useEffect(() => {
        if (onAdvanceReady) {
            console.log('ScriptExecutor: Providing advance function to parent');
            onAdvanceReady(advanceScript);
        }
    }, [advanceScript, onAdvanceReady]);

    return null; // Component doesn't render anything visible
}; 