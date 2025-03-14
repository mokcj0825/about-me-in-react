import { BuffProvider, BuffEffect } from './types';
import { UnitData } from '../types/UnitData';

export class NightPhobicDebuff implements BuffProvider {
  id = 'nightPhobicDebuff';

  getEffect(): BuffEffect {
    return {
      id: this.id,
      duration: -1,
      modifyMovement: (unit: UnitData, baseValue: number) => Math.max(1, baseValue - 2)
    };
  }
} 