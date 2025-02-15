import { useEffect } from 'react';
import { eventBus } from "./EventBus";
import { UnitSelectedEvent } from "./types/EventTypes";

export const MovementManager = () => {
  useEffect(() => {
    const handleUnitSelected = ({ unitId, position }: UnitSelectedEvent) => {
      console.log(`Calculating movement range for unit ${unitId} at (${position.x}, ${position.y}, ${position.z})`);
    };

    eventBus.on('unit-selected', handleUnitSelected);
    return () => eventBus.off('unit-selected', handleUnitSelected);
  }, []);

  return null;
};
