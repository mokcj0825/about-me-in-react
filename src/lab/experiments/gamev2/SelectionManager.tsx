import { useEffect } from 'react';
import { eventBus } from "./EventBus";

export const SelectionManager = () => {
  useEffect(() => {
    eventBus.on('unit-selected', ({ unitId }) => {
      console.log(`Unit ${unitId} selected`);
      // Handle selection logic
    });

    return () => eventBus.off('unit-selected');
  }, []);

  return null;
};
