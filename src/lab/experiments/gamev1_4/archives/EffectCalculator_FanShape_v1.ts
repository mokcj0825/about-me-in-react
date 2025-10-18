import { createHexCoordinate, getNextCoordinate } from "../types/HexCoordinate";
import { UnitData } from "../types/UnitData";
import { DirectionData } from "../types/DirectionData";
import { ShapeCalculator, ShapeConfig } from "../weapon/ShapeCalculator";
import mapData from '../data/map-data.json';
import { getDistance, HexCoordinate } from "../../game-versioning/types/HexCoordinate";

/**
 * Archive of EffectCalculator with a triangle fan shape that extends outward along the main direction
 * This version creates a triangular pattern by:
 * 1. Determining the main direction from unit to target
 * 2. Following that direction and adding side coordinates at each step
 * 3. At each step beyond the target:
 *    - Adds 1 grid in the main direction
 *    - Adds 2 side grids (one on each side)
 *    - Total of 3 new grids per step
 * 
 * Note: This was an interesting variation that creates a constant-width fan (3 grids per step),
 * different from the intended expanding fan (1->3->5->7 grids per step).
 */
export class EffectCalculator extends ShapeCalculator {
  /**
   * Check if a coordinate is within map boundaries
   */
  private static isValidCoordinate(coord: HexCoordinate): boolean {
    return coord.x >= 0 && coord.x < mapData.width &&
      coord.y >= 0 && coord.y < mapData.height;
  }

  /**
   * Get all coordinates affected by a weapon effect from a target position
   */
  static getEffectArea(
    unitPosition: HexCoordinate,
    targetPosition: HexCoordinate,
    config: ShapeConfig
  ): HexCoordinate[] {
    console.log('effectConfig', config);

    switch (config.type) {
      case 'round':
        return this.getRoundEffect(targetPosition, config.minEffectRange, config.maxEffectRange);
      case 'line':
        return this.getLineEffect(unitPosition, targetPosition, config.minEffectRange, config.maxEffectRange);
      case 'fan':
        return this.getFanEffect(unitPosition, targetPosition, config.minEffectRange, config.maxEffectRange);
      default:
        return [];
    }
  }

  /**
   * Get fan effect area - creates a widening fan pattern
   */
  private static getFanEffect(
    unitPosition: HexCoordinate,
    targetPosition: HexCoordinate,
    minRange: number,
    maxRange: number
  ): HexCoordinate[] {
    const result: HexCoordinate[] = [];
    
    // Calculate relative position
    const dx = targetPosition.x - unitPosition.x;
    const dy = targetPosition.y - unitPosition.y;
    const isUnitYEven = unitPosition.y % 2 === 0;
    
    // Determine main direction based on how target relates to unit
    let mainDirection: DirectionData;
    
    if (dy === 0) {
      // Horizontal movement: x+1 for right, x-1 for left
      mainDirection = dx > 0 ? 'right' : 'left';
    } else if (dy > 0) {
      // Moving up: For odd y, top-left is (x-1,y+1) and top-right is (x+0,y+1)
      if (isUnitYEven) {
        mainDirection = dx > 0 ? 'top-right' : 'top-left';
      } else {
        mainDirection = dx >= 0 ? 'top-right' : 'top-left';
      }
    } else {
      // Moving down: For odd y, bottom-left is (x-1,y-1) and bottom-right is (x+0,y-1)
      if (isUnitYEven) {
        mainDirection = dx > 0 ? 'bottom-right' : 'bottom-left';
      } else {
        mainDirection = dx >= 0 ? 'bottom-right' : 'bottom-left';
      }
    }
    
    // Add target position
    if (this.isValidCoordinate(targetPosition)) {
      result.push(targetPosition);
    }
    
    // Get the side directions based on the main direction
    let sideDirections: DirectionData[] = [];
    switch (mainDirection) {
      case 'right':
        sideDirections = ['top-right', 'bottom-right'];
        break;
      case 'left':
        sideDirections = ['top-left', 'bottom-left'];
        break;
      case 'top-right':
        sideDirections = ['right', 'top-left'];
        break;
      case 'top-left':
        sideDirections = ['left', 'top-right'];
        break;
      case 'bottom-right':
        sideDirections = ['right', 'bottom-left'];
        break;
      case 'bottom-left':
        sideDirections = ['left', 'bottom-right'];
        break;
    }
    
    // Add coordinates in the main direction up to maxRange
    let current = targetPosition;
    for (let i = 1; i < maxRange; i++) {
      current = getNextCoordinate(current, mainDirection);
      if (this.isValidCoordinate(current)) {
        result.push(current);
      }
      
      // Add side coordinates at this level
      for (const sideDir of sideDirections) {
        const sideCoord = getNextCoordinate(current, sideDir);
        if (this.isValidCoordinate(sideCoord)) {
          result.push(sideCoord);
        }
      }
    }
    
    // Filter by minimum range
    return result.filter(coord => 
      getDistance(targetPosition, coord) >= minRange - 1
    );
  }

  /**
   * Get line effect area
   */
  private static getLineEffect(
    unitPosition: HexCoordinate,
    targetPosition: HexCoordinate,
    minRange: number,
    maxRange: number
  ): HexCoordinate[] {
    const result: HexCoordinate[] = [];
    
    // Calculate relative position
    const dx = targetPosition.x - unitPosition.x;
    const dy = targetPosition.y - unitPosition.y;
    const isUnitYEven = unitPosition.y % 2 === 0;
    
    // Determine direction based on how target relates to unit
    let direction: DirectionData;
    
    if (dy === 0) {
      direction = dx > 0 ? 'right' : 'left';
    } else if (dy > 0) {
      if (isUnitYEven) {
        direction = dx > 0 ? 'top-right' : 'top-left';
      } else {
        direction = dx >= 0 ? 'top-right' : 'top-left';
      }
    } else {
      if (isUnitYEven) {
        direction = dx > 0 ? 'bottom-right' : 'bottom-left';
      } else {
        direction = dx >= 0 ? 'bottom-right' : 'bottom-left';
      }
    }

    // Start from target and extend in that direction
    let current = targetPosition;
    
    // Add target position
    if (this.isValidCoordinate(current)) {
      result.push(current);
    }

    // Continue in the same direction
    for (let i = 1; i < maxRange; i++) {
      current = getNextCoordinate(current, direction);
      if (this.isValidCoordinate(current)) {
        result.push(current);
      }
    }

    // Filter results based on minRange
    return result.filter((_, index) => index >= minRange - 1);
  }

  /**
   * Get round effect area
   */
  private static getRoundEffect(target: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
    return this.getGridsWithinRange(target, minRange, maxRange);
  }

  /**
   * Get all coordinates within a circular range
   */
  private static getGridsWithinRange(origin: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
    if (minRange < 0 || maxRange < 0 || maxRange < minRange) return [];

    const result: HexCoordinate[] = [];
    for (let q = -maxRange; q <= maxRange; q++) {
      for (let r = Math.max(-maxRange, -q - maxRange); r <= Math.min(maxRange, -q + maxRange); r++) {
        const coord = createHexCoordinate(origin.x + q, origin.y + r);
        if (this.isValidCoordinate(coord)) {
          result.push(coord);
        }
      }
    }

    if (minRange <= 1) return result;

    const innerGrids = this.getGridsWithinRange(origin, 0, minRange - 1);
    return result.filter(grid => 
      !innerGrids.some(inner => inner.x === grid.x && inner.y === grid.y)
    );
  }

  /**
   * Get all units affected by a weapon effect
   */
  static getAffectedUnits(
    unitPosition: HexCoordinate,
    targetPosition: HexCoordinate,
    config: ShapeConfig,
    units: UnitData[]
  ): UnitData[] {
    const affectedArea = this.getEffectArea(unitPosition, targetPosition, config);
    
    return units.filter(unit => 
      affectedArea.some(coord => 
        coord.x === unit.position.x && coord.y === unit.position.y
      )
    );
  }
} 