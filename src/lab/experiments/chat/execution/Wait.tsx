import React from 'react';
import { EventCommand } from '../EventCommand';
import { DialogEvent } from '../utils/DialogEvent';

// Interface for WAIT events
export interface WaitEvent extends DialogEvent {
    eventCommand: EventCommand.WAIT;
    time: number; // Time in milliseconds
}

// Type guard to check if an event is a wait event
export const isWaitEvent = (event: DialogEvent): event is WaitEvent => {
    return event.eventCommand === EventCommand.WAIT;
};

interface WaitProps {
    event: DialogEvent;
    onComplete: () => void;
}

const Wait: React.FC<WaitProps> = ({ event, onComplete }) => {
    // Use type guard to ensure this is a wait event
    if (!isWaitEvent(event)) {
        return null;
    }

    // Use useEffect to set a timeout for the specified duration
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, event.time); // Use milliseconds directly

        // Cleanup the timeout if the component unmounts
        return () => clearTimeout(timer);
    }, [event.time, onComplete]);

    // Return null as this component doesn't render anything
    return null;
};

export default Wait; 