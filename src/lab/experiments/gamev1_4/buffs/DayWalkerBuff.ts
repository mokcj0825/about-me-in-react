import { BuffProvider, BuffEffect } from './types';
import { UnitData } from '../types/UnitData';

export class DayWalkerBuff implements BuffProvider {
  id = 'dayWalkerBuff';

  getEffect(): BuffEffect {
    return {
      id: this.id,
      duration: -1,
      onApply: (unit: UnitData) => {
        console.log('DayWalkerBuff applied to unit:', unit);
        unit.movement += 1;
      },
      onRemove: (unit: UnitData) => {
        unit.movement = unit.baseMovement;
      },
      modifyMovement: (unit: UnitData, baseValue: number) => baseValue + 1
    };
  }
} 