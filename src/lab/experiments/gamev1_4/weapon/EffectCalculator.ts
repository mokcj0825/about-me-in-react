import { HexCoordinate, createHexCoordinate, getNextCoordinate } from "../types/HexCoordinate";
import { UnitData } from "../types/UnitData";
import { DirectionData } from "../types/DirectionData";
import { ShapeCalculator, ShapeConfig } from "./ShapeCalculator";
import mapData from '../data/map-data.json';

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
   * @param unitPosition - Position of the unit using the weapon (for direction calculation)
   * @param targetPosition - Position where the effect is centered
   * @param config - Weapon effect configuration
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

    // If minRange is 0 or 1, return all grids within maxRange
    if (minRange <= 1) {
      return result;
    }

    // Get all grids within (minRange - 1)
    const innerGrids = this.getGridsWithinRange(origin, 0, minRange - 1);

    // Return grids that are in maxRangeGrids but not in innerGrids
    return result.filter(grid => 
      !innerGrids.some(inner => inner.x === grid.x && inner.y === grid.y)
    );
  }

  /**
   * Get round effect area
   */
  private static getRoundEffect(target: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
    return this.getGridsWithinRange(target, minRange, maxRange);
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
    
    console.log('unit', unitPosition, 'target', targetPosition);
    console.log('dx', dx, 'dy', dy, 'isUnitYEven', isUnitYEven);
    
    // Determine direction based on how target relates to unit using getNextCoordinate rules
    let direction: DirectionData;
    
    if (dy === 0) {
      // Horizontal movement: x+1 for right, x-1 for left
      direction = dx > 0 ? 'right' : 'left';
      console.log('horizontal movement, dx > 0:', dx > 0);
    } else if (dy > 0) {
      // Moving up: For odd y, top-left is (x-1,y+1) and top-right is (x+0,y+1)
      if (isUnitYEven) {
        direction = dx > 0 ? 'top-right' : 'top-left';
        console.log('moving up from even row, dx > 0:', dx > 0);
      } else {
        direction = dx >= 0 ? 'top-right' : 'top-left';
        console.log('moving up from odd row, dx >= 0:', dx >= 0);
      }
    } else {
      // Moving down: For odd y, bottom-left is (x-1,y-1) and bottom-right is (x+0,y-1)
      if (isUnitYEven) {
        direction = dx > 0 ? 'bottom-right' : 'bottom-left';
        console.log('moving down from even row, dx > 0:', dx > 0);
      } else {
        direction = dx >= 0 ? 'bottom-right' : 'bottom-left';
        console.log('moving down from odd row, dx >= 0:', dx >= 0);
      }
    }

    console.log('final direction:', direction);

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
   * Get fan effect area
   */
  private static getFanEffect(
    unitPosition: HexCoordinate,
    targetPosition: HexCoordinate,
    minRange: number,
    maxRange: number
  ): HexCoordinate[] {
    const result: HexCoordinate[] = [];
    const allHexes = this.getGridsWithinRange(targetPosition, minRange, maxRange);

    // Calculate direction from unit to target
    const dx = targetPosition.x - unitPosition.x;
    const dy = targetPosition.y - unitPosition.y;

    allHexes.forEach(hex => {
      const relativeX = hex.x - targetPosition.x;
      const relativeY = hex.y - targetPosition.y;

      // Use dot product to check if hex is within 120-degree arc relative to the unit-target direction
      const dot = dx * relativeX + dy * relativeY;
      const lenSq = Math.sqrt((dx * dx + dy * dy) * (relativeX * relativeX + relativeY * relativeY));

      if (dot / lenSq >= -0.5) { // cos(120) = -0.5
        result.push(hex);
      }
    });

    return result;
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

