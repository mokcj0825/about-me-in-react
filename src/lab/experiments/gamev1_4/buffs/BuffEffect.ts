import { UnitData } from "../types/UnitData";

/**
 * Represents the effect of a buff or debuff on a unit.
 * 
 * Buffs can be triggered in several ways:
 * 1. By characteristics during phase transitions (e.g., day/night cycle)
 * 2. By direct application through game mechanics
 * 3. By turn-based events
 * 
 * State Modification Flow:
 * 1. When a buff is applied:
 *    - The `onApply` handler is called
 *    - Stat modifiers (movement, attack, defense) are calculated
 *    - Unit stats are updated with the modified values
 * 
 * 2. During each turn:
 *    - `onTurnEnd` is called if present
 *    - Duration is decremented if > 0
 *    - Buff is removed if duration reaches 0
 * 
 * 3. When a buff is removed:
 *    - The `onRemove` handler is called
 *    - Stats are recalculated without this buff's modifiers
 * 
 * Note: Stat modifications are applied in order:
 * 1. Base stats are used as starting values
 * 2. Characteristic modifiers are applied first
 * 3. Buff modifiers are applied after
 */
export interface BuffEffect {
  /** Unique identifier for the buff */
  id: string;

  /** 
   * Duration of the buff in turns
   * - -1: Permanent buff (until explicitly removed)
   * - >0: Number of turns remaining
   */
  duration: number;

  /**
   * Modifies the unit's movement stat
   * @param unit - The unit being affected
   * @param movement - The current movement value before this modifier
   * @returns The modified movement value
   * 
   * Note: Movement modifications are applied after characteristic modifiers
   * and should use Math.max(1, value) to ensure movement doesn't go below 1
   */
  modifyMovement?: (unit: UnitData, movement: number) => number;

  /**
   * Modifies the unit's attack stat
   * @param unit - The unit being affected
   * @param attack - The current attack value before this modifier
   * @returns The modified attack value
   */
  modifyAttack?: (unit: UnitData, attack: number) => number;

  /**
   * Modifies the unit's defense stat
   * @param unit - The unit being affected
   * @param defense - The current defense value before this modifier
   * @returns The modified defense value
   */
  modifyDefense?: (unit: UnitData, defense: number) => number;

  /**
   * Modifies the unit's max hitpoint
   * @param unit - The unit being affected
   * @param maxHitpoint - The current max hitpoint value before this modifier
   * @returns The modified max hitpoint value
   */
  modifyMaxHitpoint?: (unit: UnitData, maxHitpoint: number) => number;

  /**
   * Called when the buff is first applied to a unit
   * Use this to perform any initial setup or immediate effects
   * @param unit - The unit receiving the buff
   */
  onApply?: (unit: UnitData) => void;

  /**
   * Called when the buff is removed from a unit
   * Use this to clean up any changes or apply final effects
   * @param unit - The unit losing the buff
   */
  onRemove?: (unit: UnitData) => void;

  /**
   * Called at the end of each turn while the buff is active
   * Use this for periodic effects or state updates
   * @param unit - The unit with the buff
   */
  onTurnEnd?: (unit: UnitData) => void;

  /**
   * Called at the start of each day while the buff is active
   * Use this for daily effects or state updates
   * @param unit - The unit with the buff
   */
  onDayStart?: (unit: UnitData) => void;

  /**
   * Called at the start of each night while the buff is active
   * Use this for nightly effects or state updates
   * @param unit - The unit with the buff
   */
  onNightStart?: (unit: UnitData) => void;

  /**
   * Called at the start of each turn while the buff is active
   * Use this for turn-based effects or state updates
   * @param unit - The unit with the buff
   */
  onTurnStart?: (unit: UnitData) => void;

  /**
   * Called when the unit moves
   * Use this for movement-related effects or state updates
   * @param unit - The unit with the buff
   */
  onMove?: (unit: UnitData) => void;

  /**
   * Called when the unit attacks
   * Use this for attack-related effects or state updates
   * @param unit - The unit with the buff
   */
  onAttack?: (unit: UnitData) => void;

  /**
   * Called when the unit is damaged
   * Use this for damage-related effects or state updates
   * @param unit - The unit with the buff
   */
  onDamaged?: (unit: UnitData) => void;
}
