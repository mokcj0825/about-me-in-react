import { useEffect } from 'react';
import {eventBus} from "./EventBus";

export const UnitManager = () => {
  useEffect(() => {
    eventBus.on('unit-selected', ({ unitId }) => {
      console.log(`Unit ${unitId} selected`);
    });

    return () => eventBus.off('unit-selected');
  }, []);

  return null;
};