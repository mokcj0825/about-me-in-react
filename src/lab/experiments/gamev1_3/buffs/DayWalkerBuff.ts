import { BuffProvider, BuffEffect } from './types';
import { UnitData } from '../types/UnitData';

export class DayWalkerBuff implements BuffProvider {
  id = 'dayWalkerBuff';

  getEffect(): BuffEffect {
    return {
      id: this.id,
      duration: -1,
      modifyMovement: (unit: UnitData, baseValue: number) => baseValue + 1
    };
  }
} 