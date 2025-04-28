import React, { useEffect } from 'react';
import { EventCommand } from '../EventCommand';

export interface RemoveBackgroundEvent {
    eventCommand: EventCommand.REMOVE_BACKGROUND;
    transitionDuration?: number;
}

export const isRemoveBackgroundEvent = (event: any): event is RemoveBackgroundEvent => {
    return event?.eventCommand === EventCommand.REMOVE_BACKGROUND;
};

interface Props {
    event: RemoveBackgroundEvent;
    onComplete: () => void;
}

const RemoveBackground: React.FC<Props> = ({ event, onComplete }) => {
    if (!isRemoveBackgroundEvent(event)) {
        return null;
    }

    useEffect(() => {
        // Remove the background image
        const backgroundElement = document.getElementById('dialog-background');
        if (backgroundElement) {
            // Check if transitionDuration is 0 or undefined
            if (event.transitionDuration === 0 || event.transitionDuration === undefined) {
                // Remove immediately without transition
                backgroundElement.style.transition = 'none';
                backgroundElement.style.opacity = '0';
                backgroundElement.style.backgroundImage = 'none';
                
                // Call onComplete immediately
                onComplete();
            } else {
                // Remove with transition
                backgroundElement.style.transition = `opacity ${event.transitionDuration}ms ease-in-out`;
                backgroundElement.style.opacity = '0';
                
                // After the transition, remove the background image
                const timer = setTimeout(() => {
                    backgroundElement.style.backgroundImage = 'none';
                    onComplete();
                }, event.transitionDuration);
                
                return () => {
                    clearTimeout(timer);
                };
            }
        } else {
            // If no background element found, call onComplete immediately
            onComplete();
        }
    }, [event, onComplete]);

    return null;
};

export default RemoveBackground; 