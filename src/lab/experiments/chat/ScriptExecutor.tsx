import React, { useEffect, useState, useCallback } from 'react';
import { EventCommand, CharacterPosition } from './EventCommand';
import { DialogEvent } from './utils/DialogEvent';
import { characterService } from './services/CharacterService';

// Define types for script structure
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
 * ScriptExecutor
 * 
 * Responsible for loading and executing script commands.
 * Currently focused on processing background-related events and messages.
 * Emits events back to ChatCore.
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

    // Log when currentEvent changes
    useEffect(() => {
        console.log('ScriptExecutor: Current event updated:', 
            currentEvent ? `${currentEvent.eventCommand} - ${JSON.stringify(currentEvent)}` : 'null');
        
        if (currentEvent) {
            processEvent();
        }
    }, [currentEvent]);

    // Load the script data - only once per scriptId
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
                
                // Ensure finishEvent exists, even if empty
                if (!scriptData.finishEvent) {
                    scriptData.finishEvent = {};
                }
                
                setScript(scriptData);
                setScriptLoaded(true);
                
                // Initialize with first event
                if (scriptData.events.length > 0) {
                    console.log('ScriptExecutor: Setting first event:', scriptData.events[0]);
                    setCurrentEvent(scriptData.events[0]);
                } else {
                    // If no events, handle finish event immediately
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

    // Reset state when scriptId changes
    useEffect(() => {
        setScriptLoaded(false);
        setCurrentEventIndex(0);
        setCurrentEvent(null);
        setScript(null);
    }, [scriptId]);

    // Process the current event
    const processEvent = useCallback(() => {
        if (!currentEvent || !script) {
            console.log('ScriptExecutor: No current event or script to process');
            return;
        }

        console.log(`ScriptExecutor: Processing event: ${currentEvent.eventCommand}`, currentEvent);
        
        // Process events and emit to parent
        switch (currentEvent.eventCommand) {
            case EventCommand.SET_BACKGROUND:
                if ('imagePath' in currentEvent && currentEvent.imagePath) {
                    console.log('ScriptExecutor: Emitting background change:', currentEvent.imagePath);
                    onBackgroundChange?.(currentEvent.imagePath);
                }
                // Auto-advance
                advanceToNextEvent();
                break;
                
            case EventCommand.REMOVE_BACKGROUND:
                console.log('ScriptExecutor: Emitting background removal');
                onBackgroundChange?.(null);
                // Auto-advance
                advanceToNextEvent();
                break;

            case EventCommand.SHOW_CHARACTER:
                if ('position' in currentEvent) {
                    const { position } = currentEvent;
                    let sprite = '';
                    
                    // Handle both spriteUrl and res properties
                    if ('spriteUrl' in currentEvent && currentEvent.spriteUrl) {
                        sprite = currentEvent.spriteUrl;
                    } else if ('res' in currentEvent && currentEvent.res) {
                        sprite = currentEvent.res;
                    } else {
                        console.log('ScriptExecutor: Invalid SHOW_CHARACTER event - missing sprite information:', currentEvent);
                        advanceToNextEvent();
                        return;
                    }
                    
                    console.log(`ScriptExecutor: Showing character at ${position} with sprite ${sprite}`);
                    characterService.showCharacter(position as CharacterPosition, sprite);
                } else {
                    console.log('ScriptExecutor: Invalid SHOW_CHARACTER event - missing position:', currentEvent);
                }
                // Auto-advance
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
                // Auto-advance
                advanceToNextEvent();
                break;

            case EventCommand.SHOW_MESSAGE:
                console.log('ScriptExecutor: Emitting message event:', currentEvent);
                onMessageChange?.(currentEvent);
                // Don't auto-advance - wait for user click
                return;
                
            case EventCommand.CLEAR_MESSAGE:
                console.log('ScriptExecutor: Emitting clear message');
                onMessageChange?.(null);
                // Auto-advance
                advanceToNextEvent();
                break;
                
            case EventCommand.REQUEST_SELECTION:
                console.log('ScriptExecutor: Processing selection request:', currentEvent);
                // Emit the selection event to the parent component
                onMessageChange?.(currentEvent);
                // Don't auto-advance - wait for user selection
                return;
                
            case EventCommand.WAIT:
                console.log('ScriptExecutor: Processing wait event:', currentEvent);
                if ('time' in currentEvent && typeof currentEvent.time === 'number') {
                    // Wait for the specified time, then advance
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

    // Handle script completion
    const handleScriptComplete = useCallback((finishEvent: FinishEvent) => {
        console.log('ScriptExecutor: Script completed with finish event:', finishEvent);
        
        // Always notify parent about script completion, even if finishEvent is empty
        // This allows the parent to decide what to do based on the content of finishEvent
        onScriptComplete?.(finishEvent);
    }, [onScriptComplete]);

    // Function to advance to next event
    const advanceToNextEvent = useCallback(() => {
        if (!script || currentEventIndex === undefined) return;
        
        const nextIndex = currentEventIndex + 1;
        console.log(`ScriptExecutor: Advancing to next event ${nextIndex}/${script.events.length}`);
        
        if (nextIndex < script.events.length) {
            setCurrentEventIndex(nextIndex);
            setCurrentEvent(script.events[nextIndex]);
        } else {
            console.log('ScriptExecutor: No more events, handling finish event');
            // Script completed, handle finish event
            handleScriptComplete(script.finishEvent);
        }
    }, [currentEventIndex, script, handleScriptComplete]);

    // Handle manual advancement for message events
    const advanceScript = useCallback(() => {
        if (!script || !currentEvent) {
            console.log('ScriptExecutor: Cannot advance, no script or current event');
            return;
        }
        
        console.log('ScriptExecutor: Manual advance triggered for:', 
            currentEvent.eventCommand);

        // Allow advancing for message and selection events
        switch (currentEvent.eventCommand) {
            case EventCommand.SHOW_MESSAGE:
            case EventCommand.REQUEST_SELECTION:
                advanceToNextEvent();
            default:
                console.log('ScriptExecutor: Not an advanceable event, ignoring advance');
                break;
        }
        

    }, [currentEvent, advanceToNextEvent]);

    // Provide the advance function to parent component
    useEffect(() => {
        if (onAdvanceReady) {
            console.log('ScriptExecutor: Providing advance function to parent');
            onAdvanceReady(advanceScript);
        }
    }, [advanceScript, onAdvanceReady]);

    // Component doesn't render anything visible
    return null;
}; 