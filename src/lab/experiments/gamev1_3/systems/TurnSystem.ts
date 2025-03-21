import type { UnitData, UnitFaction } from '../types/UnitData';
import { hasCharacteristic } from '../types/Characteristics';
import { buffRegistry } from '../buffs/registry/BuffRegistry';

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
  
  // Let the buff registry handle all effects
  buffRegistry.applyEffects(event, updatedUnit);
  
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

export function handleAITurn(units: UnitData[], faction: UnitFaction): UnitData[] {
  // First, reset movement for units of the current faction
  const resetUnits = handleFactionTurn(units, faction);

  // - Path finding
  // - Target selection
  // - Combat decisions
  // - Formation maintenance
  // - Strategic objectives
  
  return resetUnits; // Return units with reset movement, even if AI hasn't moved yet
} 