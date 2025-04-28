import React from 'react';
import { EventCommand } from '../EventCommand';
import { DialogEvent } from '../utils/DialogEvent';

// Interface for CLEAR_MESSAGE events
export interface ClearMessageEvent extends DialogEvent {
    eventCommand: EventCommand.CLEAR_MESSAGE;
}

export const isClearMessageEvent = (event: DialogEvent): event is ClearMessageEvent => {
    return event.eventCommand === EventCommand.CLEAR_MESSAGE;
};

interface ClearMessageProps {
    event: DialogEvent;
    onComplete: () => void;
}

const ClearMessage: React.FC<ClearMessageProps> = ({ event, onComplete }) => {
    // Use type guard to ensure this is a clear message event
    if (!isClearMessageEvent(event)) {
        return null;
    }

    // Immediately call onComplete to proceed to the next event
    React.useEffect(() => {
        // Clear the message by calling onComplete
        onComplete();
    }, [onComplete]);

    // Return null as this component doesn't render anything
    return null;
};

export default ClearMessage; 