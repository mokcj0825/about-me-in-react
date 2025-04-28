import React, { useEffect } from 'react';
import { EventCommand } from '../EventCommand';

// Constants for configuration
const BACKGROUND_CONFIG = {
    BASE_PATH: '/background/',
} as const;

export interface SetBackgroundEvent {
    eventCommand: EventCommand.SET_BACKGROUND;
    imagePath: string;
    transitionDuration?: number;
}

export const isSetBackgroundEvent = (event: any): event is SetBackgroundEvent => {
    return event?.eventCommand === EventCommand.SET_BACKGROUND;
};

interface Props {
    event: SetBackgroundEvent;
    onComplete: () => void;
}

const SetBackground: React.FC<Props> = ({ event, onComplete }) => {
    if (!isSetBackgroundEvent(event)) {
        return null;
    }

    useEffect(() => {
        // Apply the background image
        const backgroundElement = document.getElementById('dialog-background');
        if (backgroundElement) {
            // Construct the full path using the base path
            const fullImagePath = `${BACKGROUND_CONFIG.BASE_PATH}${event.imagePath}`;
            
            // Check if transitionDuration is 0 or undefined
            if (event.transitionDuration === 0 || event.transitionDuration === undefined) {
                // Apply immediately without transition
                backgroundElement.style.transition = 'none';
                backgroundElement.style.backgroundImage = `url(${fullImagePath})`;
                backgroundElement.style.opacity = '1';
                
                // Call onComplete immediately
                onComplete();
            } else {
                // Apply with transition
                backgroundElement.style.transition = `opacity ${event.transitionDuration}ms ease-in-out`;
                backgroundElement.style.backgroundImage = `url(${fullImagePath})`;
                backgroundElement.style.opacity = '1';
                
                // Call onComplete after the transition
                const timer = setTimeout(() => {
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

export default SetBackground; 