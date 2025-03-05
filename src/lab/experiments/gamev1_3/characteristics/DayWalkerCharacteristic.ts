import { CharacteristicProvider, CharacteristicEffect } from './types';
import { UnitData } from '../types/UnitData';
import { buffRegistry } from '../buffs/registry/BuffRegistry';

export class DayWalkerCharacteristic implements CharacteristicProvider {
  id = 'dayWalker';

  getEffect(): CharacteristicEffect {
    return {
      id: this.id,
      onDayStart: (unit: UnitData) => {
        unit.buffs = unit.buffs || [];
        unit.buffs.push({
          id: 'dayWalkerBuff',
          duration: -1  // Permanent until night
        });
      },
      onNightStart: (unit: UnitData) => {
        unit.buffs = (unit.buffs || []).filter(buff => buff.id !== 'dayWalkerBuff');
      }
    };
  }
} 