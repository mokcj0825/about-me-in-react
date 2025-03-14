import { UnitData, Buff } from '../types/UnitData';

export function addBuff(unit: UnitData, buffId: string, duration: number): UnitData {
  const newBuff: Buff = { id: buffId, duration };
  return {
    ...unit,
    buffs: [...(unit.buffs || []), newBuff]
  };
}

export function removeBuff(unit: UnitData, buffId: string): UnitData {
  if (!unit.buffs) return unit;
  
  return {
    ...unit,
    buffs: unit.buffs.filter(buff => buff.id !== buffId)
  };
} 