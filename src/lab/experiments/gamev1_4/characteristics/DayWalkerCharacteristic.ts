import { CharacteristicProvider, CharacteristicEffect } from './types';
import { UnitData } from '../types/UnitData';
import { buffRegistry } from '../buffs/registry/BuffRegistry';

export class DayWalkerCharacteristic implements CharacteristicProvider {
  id = '00005';

  getEffect(): CharacteristicEffect {
    return {
      id: this.id,
      onDayStart: (unit: UnitData) => {
        //console.log('DayWalkerCharacteristic - onDayStart called for unit:', unit);
        unit.buffs = unit.buffs || [];
        
        // Check if unit already has the buff
        const hasDayWalkerBuff = unit.buffs.some(buff => buff.id === 'dayWalkerBuff');
        
        if (!hasDayWalkerBuff) {
          unit.buffs.push({
            id: 'dayWalkerBuff',
            duration: -1  // Permanent until night
          });
          //console.log('DayWalkerCharacteristic - Added dayWalkerBuff to unit:', unit);
        }
      },
      onNightStart: (unit: UnitData) => {
        //console.log('DayWalkerCharacteristic - onNightStart called for unit:', unit);
        unit.buffs = (unit.buffs || []).filter(buff => buff.id !== 'dayWalkerBuff');
        //console.log('DayWalkerCharacteristic - Removed dayWalkerBuff from unit:', unit);
      }
    };
  }
} 