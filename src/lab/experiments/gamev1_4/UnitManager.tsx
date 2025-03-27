import { useEffect, useState } from 'react';
import { eventBus } from "./EventBus";
import { UnitData, initialUnits } from "./types/UnitData";
import { characteristicRegistry } from './characteristics/registry/CharacteristicRegistry';

export const UnitManager = () => {
  const [units, setUnits] = useState<UnitData[]>(initialUnits);

  useEffect(() => {
    const handleCycleChanged = ({ type }: { type: 'onDayStart' | 'onNightStart' }) => {
      //console.log('Cycle changed:', type);
      //console.log('Current units:', units);
      
      units.forEach(unit => {
        //console.log('Processing unit:', unit);
        if (type === 'onDayStart') {
          characteristicRegistry.onDayStart(unit);
        } else {
          characteristicRegistry.onNightStart(unit);
        }
      });
    };

    eventBus.on('cycle-changed', handleCycleChanged);

    return () => {
      eventBus.off('cycle-changed', handleCycleChanged);
    };
  }, [units]);

  return null;
};