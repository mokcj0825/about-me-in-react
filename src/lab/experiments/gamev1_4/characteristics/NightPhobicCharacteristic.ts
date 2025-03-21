import { CharacteristicProvider, CharacteristicEffect } from './types';
import { UnitData } from '../types/UnitData';
import { buffRegistry } from '../buffs/registry/BuffRegistry';

export class NightPhobicCharacteristic implements CharacteristicProvider {
  id = '00006';

  getEffect(): CharacteristicEffect {
    return {
      id: this.id,
      onNightStart: (unit: UnitData) => {
        console.log('NightPhobicCharacteristic - onNightStart called for unit:', unit);
        unit.buffs = unit.buffs || [];
        
        // Check if unit already has the debuff
        const hasNightPhobicDebuff = unit.buffs.some(buff => buff.id === 'nightPhobicDebuff');
        
        if (!hasNightPhobicDebuff) {
          unit.buffs.push({
            id: 'nightPhobicDebuff',
            duration: -1  // Permanent until day
          });
          console.log('NightPhobicCharacteristic - Added nightPhobicDebuff to unit:', unit);
        }
      },
      onDayStart: (unit: UnitData) => {
        console.log('NightPhobicCharacteristic - onDayStart called for unit:', unit);
        unit.buffs = (unit.buffs || []).filter(buff => buff.id !== 'nightPhobicDebuff');
        console.log('NightPhobicCharacteristic - Removed nightPhobicDebuff from unit:', unit);
      }
    };
  }
} 