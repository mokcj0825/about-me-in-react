import { useEffect } from 'react';
import { eventBus } from "./EventBus";

export const TerrainManager = () => {
  useEffect(() => {
    eventBus.on('unit-selected', ({ unitId }) => {
      // Check terrain effects
      console.log(`Checking terrain effects for unit ${unitId}`);
    });

    return () => eventBus.off('unit-selected');
  }, []);

  return null;
};
