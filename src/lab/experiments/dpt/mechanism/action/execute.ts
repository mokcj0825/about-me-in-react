import { Unit } from '../../type/InstructionData';
import { KnockoutEvent, checkAndHandleKnockout } from '../event/knockout';

export interface ActionResult {
  /** Amount of damage dealt */
  damage: number;
  /** Change in energy (positive for gain, negative for cost) */
  energyChange: number;
  /** Description of the action */
  description: string;
}

export interface ActionOutcome {
  /** The updated state of the attacking unit */
  attackerUnit: Unit;
  /** The updated state of the target unit */
  targetUnit: Unit;
  /** Description of what happened */
  description: string;
  /** Event triggered if the target was knocked out */
  knockoutEvent: KnockoutEvent | null;
}

export type ActionType = 'normal' | 'skill' | 'ultimate';

/**
 * Applies damage and energy changes to a unit
 */
function applyActionResult(unit: Unit, damage: number, energyChange: number): Unit {
  const newHp = Math.max(0, (unit.hp || 0) - damage);
  const newEnergy = Math.min(
    unit.maxEnergy || 100,
    Math.max(0, (unit.energy || 0) + energyChange)
  );

  return {
    ...unit,
    hp: newHp,
    energy: newEnergy
  };
}

/**
 * Checks if a unit can perform a specific action
 */
export function canPerformAction(unit: Unit, actionType: ActionType): boolean {
  if (!unit.energy) return false;

  switch (actionType) {
    case 'normal':
      return true;
    case 'skill':
      return unit.energy >= 30;
    case 'ultimate':
      return unit.energy >= 100;
    default:
      return false;
  }
}

/**
 * Executes a normal attack from a player unit
 */
export function executeNormalAttack(
  attacker: Unit,
  target: Unit,
  teamBlessingAvailable: boolean
): ActionOutcome {
  const result: ActionResult = {
    damage: attacker.attack || 0,
    energyChange: 20,
    description: `${attacker.name} performs a normal attack on ${target.name}`
  };

  const updatedAttacker = applyActionResult(attacker, 0, result.energyChange);
  const { updatedUnit: updatedTarget, knockoutEvent } = checkAndHandleKnockout(
    applyActionResult(target, result.damage, 0),
    attacker,
    teamBlessingAvailable
  );

  return {
    attackerUnit: updatedAttacker,
    targetUnit: updatedTarget,
    description: knockoutEvent 
      ? `${result.description}, knocking out ${target.name}!`
      : `${result.description}, dealing ${result.damage} damage`,
    knockoutEvent
  };
}

/**
 * Executes a skill attack from a player unit
 */
export function executeSkill(
  attacker: Unit,
  target: Unit,
  teamBlessingAvailable: boolean
): ActionOutcome {
  const baseDamage = attacker.attack || 0;
  const skillMultiplier = 1.5;
  const result: ActionResult = {
    damage: Math.floor(baseDamage * skillMultiplier),
    energyChange: -30,
    description: `${attacker.name} uses skill on ${target.name}`
  };

  const updatedAttacker = applyActionResult(attacker, 0, result.energyChange);
  const { updatedUnit: updatedTarget, knockoutEvent } = checkAndHandleKnockout(
    applyActionResult(target, result.damage, 0),
    attacker,
    teamBlessingAvailable
  );

  return {
    attackerUnit: updatedAttacker,
    targetUnit: updatedTarget,
    description: knockoutEvent 
      ? `${result.description}, knocking out ${target.name}!`
      : `${result.description}, dealing ${result.damage} damage`,
    knockoutEvent
  };
}

/**
 * Executes an ultimate attack from a player unit
 */
export function executeUltimate(
  attacker: Unit,
  target: Unit,
  teamBlessingAvailable: boolean
): ActionOutcome {
  const baseDamage = attacker.attack || 0;
  const ultimateMultiplier = 2.5;
  const result: ActionResult = {
    damage: Math.floor(baseDamage * ultimateMultiplier),
    energyChange: -100,
    description: `${attacker.name} unleashes ultimate on ${target.name}`
  };

  const updatedAttacker = applyActionResult(attacker, 0, result.energyChange);
  const { updatedUnit: updatedTarget, knockoutEvent } = checkAndHandleKnockout(
    applyActionResult(target, result.damage, 0),
    attacker,
    teamBlessingAvailable
  );

  return {
    attackerUnit: updatedAttacker,
    targetUnit: updatedTarget,
    description: knockoutEvent 
      ? `${result.description}, knocking out ${target.name}!`
      : `${result.description}, dealing ${result.damage} damage`,
    knockoutEvent
  };
}

/**
 * Executes an attack from an enemy unit
 */
export function executeEnemyAttack(
  attacker: Unit,
  target: Unit,
  teamBlessingAvailable: boolean
): ActionOutcome {
  const result: ActionResult = {
    damage: attacker.attack || 0,
    energyChange: 0,
    description: `${attacker.name} attacks ${target.name}`
  };

  const updatedAttacker = attacker;
  const { updatedUnit: updatedTarget, knockoutEvent } = checkAndHandleKnockout(
    applyActionResult(target, result.damage, 0),
    attacker,
    teamBlessingAvailable
  );

  return {
    attackerUnit: updatedAttacker,
    targetUnit: updatedTarget,
    description: knockoutEvent 
      ? `${result.description}, knocking out ${target.name}!`
      : `${result.description}, dealing ${result.damage} damage`,
    knockoutEvent
  };
} 