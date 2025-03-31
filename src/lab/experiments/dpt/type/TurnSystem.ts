import { BlessingEffect } from '../mechanism/blessing/types';
import { Unit } from './InstructionData';

/**
 * Represents a unit's state in the turn system
 */
export interface TurnUnit extends Unit {
  /** Current action value (time until next turn) */
  actionValue: number;
  /** Base action value (10000/speed) */
  baseActionValue: number;
  /** Status effects that are active on this unit */
  statusEffects: StatusEffect[];
  /** Whether this unit can act (not stunned, frozen, etc.) */
  canAct: boolean;
  /** Unit's speed stat, determines turn order */
  spd: number;
  /** Whether this unit has been resurrected this battle */
  wasResurrected?: boolean;
  /** Buffs that are active on this unit */
  buffs: Buff[];
}

/**
 * Types of status effects that can be applied to units
 */
export enum StatusEffectType {
  DOT = 'dot',           // Damage over time
  BUFF = 'buff',         // Stat increase
  DEBUFF = 'debuff',     // Stat decrease
  STUN = 'stun',         // Cannot act
  SPEED_MOD = 'speed',   // Modifies speed/action value
}

/**
 * Represents a status effect on a unit
 */
export interface StatusEffect {
  /** Type of status effect */
  type: StatusEffectType;
  /** Duration in turns */
  duration: number;
  /** Value of the effect (damage for DoT, % for buffs) */
  value: number;
  /** Whether this effect ticks at start of turn */
  ticksAtStart: boolean;
  /** Whether this effect has ticked this turn */
  hasTickedThisTurn: boolean;
  /** ID of the source unit that applied this effect */
  sourceId?: string;
  /** Description of the effect for logging */
  description: string;
}

/**
 * Represents a buff on a unit
 */
export interface Buff {
  /** ID of the buff */
  id: string;
  /** Type of the buff */
  type: 'resurrection' | 'prevent_knockout' | string;
  /** ID of the source unit that created this buff */
  source: string;
  /** Whether the buff is consumable */
  consumable: boolean;
  /** Whether the buff applies to the whole team */
  teamwide: boolean;
  /** Effects of the buff */
  effects: BlessingEffect[];
}

/**
 * Context for battle effects like blessings
 */
export interface BattleContext {
  /** Amount of energy consumed in the action */
  consumedEnergy?: number;
  /** Amount of incoming damage */
  incomingDamage?: number;
  /** ID of the source unit */
  sourceId?: string;
}

/**
 * Represents the current state of the turn system
 */
export interface TurnState {
  /** All units in the battle */
  units: TurnUnit[];
  /** Currently active unit */
  activeUnit: TurnUnit | null;
  /** Turn counter */
  turnCount: number;
  /** Whether the battle is paused (e.g. for ultimate) */
  isPaused: boolean;
  /** Available blessings */
  blessings: string[];
}

/**
 * Result of processing a turn
 */
export interface TurnResult {
  /** Updated turn state */
  newState: TurnState;
  /** Array of events that occurred during the turn */
  events: TurnEvent[];
}

/**
 * Events that can occur during a turn
 */
export interface TurnEvent {
  /** Type of event */
  type: 'dot_damage' | 'status_tick' | 'turn_start' | 'turn_end' | 'action' | 'death' | 'effect';
  /** Unit affected by the event */
  unit: TurnUnit;
  /** Additional data about the event */
  data?: Record<string, unknown>;
  /** Description of what happened */
  description: string;
}

/**
 * Calculates the base action value for a given speed
 */
export function calculateBaseActionValue(speed: number): number {
  return 10000 / speed;
}

/**
 * Creates a TurnUnit from a regular Unit
 * If speed is not defined in the unit data, defaults to 100
 */
export function createTurnUnit(unit: Unit): TurnUnit {
  const speed = (unit as any).spd ?? 100;
  const baseActionValue = calculateBaseActionValue(speed);
  return {
    ...unit,
    spd: speed,
    actionValue: baseActionValue,
    baseActionValue,
    statusEffects: [],
    canAct: true,
    wasResurrected: false,
    buffs: []
  };
} 