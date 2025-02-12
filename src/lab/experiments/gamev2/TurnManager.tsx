import { useEffect } from 'react';
import { eventBus } from "./EventBus";

export const TurnManager = () => {
  useEffect(() => {
    eventBus.on('unit-selected', ({ unitId }) => {
      // Validate turn and unit ownership
      console.log(`Validating turn for unit ${unitId}`);
    });

    return () => eventBus.off('unit-selected');
  }, []);

  return null;
};
