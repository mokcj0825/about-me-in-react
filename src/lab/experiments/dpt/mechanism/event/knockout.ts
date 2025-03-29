import { Unit } from '../../type/InstructionData';

export interface KnockoutEvent {
  /** The unit that was knocked out */
  unit: Unit;
  /** The unit that caused the knockout */
  attacker: Unit;
  /** Whether resurrection is possible */
  canResurrect: boolean;
  /** When the knockout occurred */
  timestamp: number;
}

export interface KnockoutResult {
  /** The updated unit after checking for knockout */
  updatedUnit: Unit;
  /** The knockout event if one occurred */
  knockoutEvent: KnockoutEvent | null;
}

/**
 * Checks if a unit is knocked out (HP <= 0)
 */
export function isKnockedOut(unit: Unit): boolean {
  return (unit.hp || 0) <= 0;
}

/**
 * Checks if a unit can be resurrected based on energy and team blessing
 */
export function canResurrect(unit: Unit, teamBlessingAvailable: boolean): boolean {
  return teamBlessingAvailable && (unit.energy || 0) >= 50;
}

/**
 * Handles the knockout check for a unit and creates a knockout event if necessary
 */
export function checkAndHandleKnockout(
  unit: Unit,
  attacker: Unit,
  teamBlessingAvailable: boolean
): KnockoutResult {
  if (!isKnockedOut(unit)) {
    return {
      updatedUnit: unit,
      knockoutEvent: null
    };
  }

  const canBeResurrected = canResurrect(unit, teamBlessingAvailable);
  const knockoutEvent: KnockoutEvent = {
    unit,
    attacker,
    canResurrect: canBeResurrected,
    timestamp: Date.now()
  };

  // Return the updated unit with hp set to 0
  return {
    updatedUnit: {
      ...unit,
      hp: 0
    },
    knockoutEvent
  };
} 