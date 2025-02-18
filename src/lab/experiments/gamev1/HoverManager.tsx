import { useEffect } from 'react';
import { eventBus } from "./EventBus";

export const HoverManager = () => {
  useEffect(() => {
    eventBus.on('unit-hovered', ({ unitId }) => {
      console.log(`Unit ${unitId} hovered`);
    });

    return () => eventBus.off('unit-hovered');
  }, []);

  return null;
};
