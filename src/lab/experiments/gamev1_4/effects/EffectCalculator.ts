import { HexCoordinate, createHexCoordinate } from "../types/HexCoordinate";
import { UnitData } from "../types/UnitData";

/**
 * Represents the shape and size of an effect area
 */
export type EffectShape = 
  | { type: 'single' }                    // Single target
  | { type: 'cross', size: number }       // Cross shape with given size
  | { type: 'square', size: number }      // Square with given size
  | { type: 'line', size: number }        // Line with given length
  | { type: 'circle', radius: number };   // Circle with given radius

/**
 * Represents a weapon's effect configuration
 */
export interface EffectConfig {
  shape: EffectShape;
  range: number;           // Maximum range from caster
  includesCaster: boolean; // Whether the effect includes the casting unit
  requiresTarget: boolean; // Whether the effect needs a target to calculate area
}

export class EffectCalculator {
  /**
   * Get all valid target positions for a weapon effect
   * @param casterPosition - Position of the unit using the weapon
   * @param effectConfig - Configuration of the weapon effect
   * @returns Array of valid target coordinates
   */
  static getValidTargets(
    casterPosition: HexCoordinate,
    effectConfig: EffectConfig
  ): HexCoordinate[] {
    // For now, just return coordinates within range
    const targets: HexCoordinate[] = [];
    const range = effectConfig.range;

    // Iterate through potential coordinates within range
    for (let q = -range; q <= range; q++) {
      for (let r = Math.max(-range, -q - range); r <= Math.min(range, -q + range); r++) {
        const x = casterPosition.x + q;
        const y = casterPosition.y + r;
        
        // Skip the caster's position if not included
        if (!effectConfig.includesCaster && x === casterPosition.x && y === casterPosition.y) {
          continue;
        }

        targets.push(createHexCoordinate(x, y));
      }
    }

    return targets;
  }

  /**
   * Get all coordinates affected by a weapon effect from a target position
   * @param targetPosition - Position where the effect is centered
   * @param effectConfig - Configuration of the weapon effect
   * @returns Array of affected coordinates
   */
  static getEffectArea(
    targetPosition: HexCoordinate,
    effectConfig: EffectConfig
  ): HexCoordinate[] {
    const affected: HexCoordinate[] = [];

    switch (effectConfig.shape.type) {
      case 'single':
        affected.push(createHexCoordinate(targetPosition.x, targetPosition.y));
        break;

      case 'cross':
        affected.push(createHexCoordinate(targetPosition.x, targetPosition.y));
        const size = effectConfig.shape.size;
        // Add cardinal directions
        for (let i = 1; i <= size; i++) {
          affected.push(createHexCoordinate(targetPosition.x + i, targetPosition.y)); // right
          affected.push(createHexCoordinate(targetPosition.x - i, targetPosition.y)); // left
          affected.push(createHexCoordinate(targetPosition.x, targetPosition.y + i)); // down
          affected.push(createHexCoordinate(targetPosition.x, targetPosition.y - i)); // up
        }
        break;

      case 'square':
        const squareSize = effectConfig.shape.size;
        for (let dx = -squareSize; dx <= squareSize; dx++) {
          for (let dy = -squareSize; dy <= squareSize; dy++) {
            affected.push(createHexCoordinate(
              targetPosition.x + dx,
              targetPosition.y + dy
            ));
          }
        }
        break;

      case 'circle':
        const radius = effectConfig.shape.radius;
        for (let q = -radius; q <= radius; q++) {
          for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
            affected.push(createHexCoordinate(
              targetPosition.x + q,
              targetPosition.y + r
            ));
          }
        }
        break;

      case 'line':
        // For now, just extend right from target
        const lineSize = effectConfig.shape.size;
        for (let i = 0; i <= lineSize; i++) {
          affected.push(createHexCoordinate(
            targetPosition.x + i,
            targetPosition.y
          ));
        }
        break;
    }

    return affected;
  }

  /**
   * Get all units affected by a weapon effect
   * @param targetPosition - Position where the effect is centered
   * @param effectConfig - Configuration of the weapon effect
   * @param units - All units on the map
   * @returns Array of affected units
   */
  static getAffectedUnits(
    targetPosition: HexCoordinate,
    effectConfig: EffectConfig,
    units: UnitData[]
  ): UnitData[] {
    const affectedArea = this.getEffectArea(targetPosition, effectConfig);
    
    return units.filter(unit => 
      affectedArea.some(coord => 
        coord.x === unit.position.x && coord.y === unit.position.y
      )
    );
  }
} 