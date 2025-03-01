import type { UnitData, UnitFaction } from '../types/UnitData';
import { hasCharacteristic } from '../types/Characteristics';

export type TurnPhase = 'player' | 'ally' | 'enemy';
export type DayNightCycle = 'day' | 'night';
export type PhaseEvent = 'onDayStart' | 'onDayEnd' | 'onNightStart' | 'onNightEnd';

export interface TurnState {
  number: number;
  cycle: DayNightCycle;
  phase: TurnPhase;
}

function handleCharacteristicEffects(unit: UnitData, event: PhaseEvent): UnitData {
  let updatedUnit = { ...unit };
  
  // Debug logging
  console.log('Processing unit:', unit.id, 'for event:', event);
  console.log('Current characteristics:', unit.characteristics);
  console.log('Current buffs:', unit.buffs);
  
  switch(event) {
    case 'onDayStart':
      if (hasCharacteristic(unit.characteristics, [], 'dayWalker') && 
          !unit.buffs.some(buff => buff.source === 'dayWalker')) {
        updatedUnit.buffs = [...unit.buffs, { 
          id: 'dayWalker_buff',
          source: 'dayWalker',
          value: 1,
          characteristicId: '00005',
          duration: 1
        }];
        updatedUnit.movement += 1;
      }
      break;
      
    case 'onDayEnd':
      if (unit.buffs.some(buff => buff.source === 'dayWalker')) {
        updatedUnit.buffs = unit.buffs.filter(buff => buff.source !== 'dayWalker');
        updatedUnit.movement -= 1;
      }
      break;
      
    case 'onNightStart':
      if (hasCharacteristic(unit.characteristics, [], 'nightPhobic') && 
          !unit.buffs.some(buff => buff.source === 'nightPhobic')) {
        updatedUnit.buffs = [...unit.buffs, {
          id: 'nightPhobic_debuff',
          source: 'nightPhobic',
          value: -2,
          characteristicId: '00006',
          duration: 1
        }];
        updatedUnit.movement -= 2;
      }
      break;
      
    case 'onNightEnd':
      if (unit.buffs.some(buff => buff.source === 'nightPhobic')) {
        updatedUnit.buffs = unit.buffs.filter(buff => buff.source !== 'nightPhobic');
        updatedUnit.movement += 2;
      }
      break;
  }

  console.log('Updated unit:', updatedUnit);
  return updatedUnit;
}

export function handlePhaseEvent(units: UnitData[], event: PhaseEvent): UnitData[] {
  return units.map(unit => handleCharacteristicEffects(unit, event));
}

export function advanceTurn(currentTurn: TurnState): TurnState {
  // Phase rotation: player -> ally -> enemy -> next cycle
  switch (currentTurn.phase) {
    case 'player':
      return { ...currentTurn, phase: 'ally' };
      
    case 'ally':
      return { ...currentTurn, phase: 'enemy' };
      
    case 'enemy':
      // End of all phases, switch cycle
      if (currentTurn.cycle === 'day') {
        return {
          ...currentTurn,
          cycle: 'night',
          phase: 'player'
        };
      } else {
        // Night ends, new day starts
        return {
          number: currentTurn.number + 1,
          cycle: 'day',
          phase: 'player'
        };
      }
  }
}

// Handle unit movements per faction
export function handleFactionTurn(units: UnitData[], faction: UnitFaction): UnitData[] {
  return units.map(unit => ({
    ...unit,
    // Reset movement only for units of the current faction
    hasMoved: unit.faction === faction ? false : unit.hasMoved
  }));
}

// TODO: Implement AI movement for ally and enemy units
export function handleAITurn(units: UnitData[], faction: UnitFaction): UnitData[] {
  // TODO: Add AI logic for unit movement
  // TODO: Consider:
  // - Path finding
  // - Target selection
  // - Combat decisions
  // - Formation maintenance
  // - Strategic objectives
  return units;
} 