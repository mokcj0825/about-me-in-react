import { useEffect } from 'react';
import { eventBus } from "./EventBus";

export const MovementManager = () => {
  useEffect(() => {
    eventBus.on('unit-selected', ({ unitId }) => {
      // Calculate and show movement range
      console.log(`Calculating movement range for unit ${unitId}`);
    });

    return () => eventBus.off('unit-selected');
  }, []);

  return null;
};
