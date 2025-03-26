import { HexCoordinate, createHexCoordinate, getNextCoordinate, getDistance } from "../types/HexCoordinate";
import { UnitData } from "../types/UnitData";
import { DirectionData, ALL_DIRECTIONS } from "../types/DirectionData";
import { ShapeCalculator, ShapeConfig, ShapeType } from "./ShapeCalculator";
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

    const result: Set<string> = new Set();
    const visited: Set<string> = new Set();

    // Helper to add a coordinate if valid
    const addCoord = (coord: HexCoordinate, distance: number) => {
      const key = `${coord.x},${coord.y}`;
      if (!visited.has(key) && this.isValidCoordinate(coord)) {
        visited.add(key);
        if (distance >= minRange && distance <= maxRange) {
          result.add(key);
        }
      }
    };

    // Start with origin
    let currentRing: HexCoordinate[] = [origin];
    let distance = 0;

    // Process each ring
    while (distance <= maxRange) {
      const nextRing: HexCoordinate[] = [];

      // Process current ring
      for (const coord of currentRing) {
        addCoord(coord, distance);

        // If we haven't reached maxRange, add adjacent hexes to next ring
        if (distance < maxRange) {
          for (const dir of ALL_DIRECTIONS) {
            const next = getNextCoordinate(coord, dir);
            const key = `${next.x},${next.y}`;
            if (!visited.has(key)) {
              nextRing.push(next);
            }
          }
        }
      }

      currentRing = nextRing;
      distance++;
    }

    // Convert back to coordinates
    return Array.from(result).map(key => {
      const [x, y] = key.split(',').map(Number);
      return createHexCoordinate(x, y);
    });
  }

  /**
   * Get round effect area
   */
  private static getRoundEffect(target: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
    // Special case for single target
    if (minRange === 1 && maxRange === 1) {
      return [target];
    }

    return this.getGridsWithinRange(target, minRange, maxRange);
  }

  /**
   * Helper to determine direction based on relative position
   */
  private static getDirectionFromDelta(
    dx: number,
    dy: number,
    isUnitYEven: boolean
  ): DirectionData {
    if (dy === 0) {
      return dx > 0 ? 'right' : 'left';
    } else if (dy > 0) {
      if (isUnitYEven) {
        return dx > 0 ? 'top-right' : 'top-left';
      } else {
        return dx >= 0 ? 'top-right' : 'top-left';
      }
    } else {
      if (isUnitYEven) {
        return dx > 0 ? 'bottom-right' : 'bottom-left';
      } else {
        return dx >= 0 ? 'bottom-right' : 'bottom-left';
      }
    }
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

    const direction = this.getDirectionFromDelta(dx, dy, isUnitYEven);

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
    const result: Set<string> = new Set(); // Use Set to handle duplicates
    
    // Calculate relative position
    const dx = targetPosition.x - unitPosition.x;
    const dy = targetPosition.y - unitPosition.y;
    const isUnitYEven = unitPosition.y % 2 === 0;
    
    // Define directions in clockwise order
    const DIRECTIONS: DirectionData[] = [
      'right',
      'bottom-right',
      'bottom-left',
      'left',
      'top-left',
      'top-right'
    ];
    
    // Determine main direction based on how target relates to unit
    const mainDirection = this.getDirectionFromDelta(dx, dy, isUnitYEven);
    
    // Find the index of main direction
    const mainIndex = DIRECTIONS.indexOf(mainDirection);
    
    // Get side directions using circular array
    const leftSide = DIRECTIONS[(mainIndex + 5) % 6]; // +5 is same as -1
    const rightSide = DIRECTIONS[(mainIndex + 1) % 6];
    
    console.log('Directions:', {
      main: mainDirection,
      left: leftSide,
      right: rightSide
    });

    // Helper function to add a coordinate to result if valid
    const addCoord = (coord: HexCoordinate) => {
      if (this.isValidCoordinate(coord)) {
        result.add(`${coord.x},${coord.y}`);
      }
    };

    // Helper function to get next hex in a direction
    const getNextHex = (pos: HexCoordinate, dir: DirectionData): HexCoordinate => {
      return getNextCoordinate(pos, dir);
    };

    // Range 1: Add target position
    addCoord(targetPosition);
    let currentHexes = [targetPosition];

    // For each range step
    for (let range = minRange; range < maxRange; range++) {
      const nextHexes: HexCoordinate[] = [];

      // For each current hex
      for (const hex of currentHexes) {
        // For each direction
        [mainDirection, leftSide, rightSide].forEach(dir => {
          const nextHex = getNextHex(hex, dir);
          if (this.isValidCoordinate(nextHex)) {
            addCoord(nextHex);
            nextHexes.push(nextHex);
          }
        });
      }

      currentHexes = nextHexes;
    }
    
    // Convert coordinates back to HexCoordinate objects
    const finalResult = Array.from(result).map(coord => {
      const [x, y] = coord.split(',').map(Number);
      return createHexCoordinate(x, y);
    });

    // Filter by minimum range if needed
    if (minRange > 1) {
      return finalResult.filter(coord => 
        getDistance(targetPosition, coord) >= minRange - 1
      );
    }
    
    return finalResult;
  }
  
  /**
   * Helper to follow a direction for a number of steps
   */
  private static followDirection(start: HexCoordinate, direction: DirectionData, steps: number): HexCoordinate {
    let current = start;
    for (let i = 0; i < steps; i++) {
      current = getNextCoordinate(current, direction);
    }
    return current;
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

