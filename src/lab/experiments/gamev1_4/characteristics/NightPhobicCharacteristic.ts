import { CharacteristicProvider, CharacteristicEffect } from './types';
import { UnitData } from '../types/UnitData';
import { buffRegistry } from '../buffs/registry/BuffRegistry';

export class NightPhobicCharacteristic implements CharacteristicProvider {
  id = 'nightPhobic';

  getEffect(): CharacteristicEffect {
    return {
      id: this.id,
      onNightStart: (unit: UnitData) => {
        unit.buffs = unit.buffs || [];
        unit.buffs.push({
          id: 'nightPhobicDebuff',
          duration: -1  // Permanent until day
        });
      },
      onDayStart: (unit: UnitData) => {
        unit.buffs = (unit.buffs || []).filter(buff => buff.id !== 'nightPhobicDebuff');
      }
    };
  }
} 