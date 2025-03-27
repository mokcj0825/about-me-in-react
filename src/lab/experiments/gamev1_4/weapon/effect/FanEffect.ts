import { HexCoordinate, createHexCoordinate, getNextCoordinate, getDistance } from "../../types/HexCoordinate";
import { DirectionData } from "../../types/DirectionData";
import { BaseEffect } from "./IEffect";

/**
 * Implementation of fan-shaped area effect
 */
export class FanEffect extends BaseEffect {

  static override getEffectArea(
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

    // Helper function to add a coordinate to result if valid
    const addCoord = (coordinate: HexCoordinate) => {
      if (this.isValidCoordinate(coordinate)) {
        result.add(`${coordinate.x},${coordinate.y}`);
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
    const finalResult = Array.from(result).map(coordinate => {
      const [x, y] = coordinate.split(',').map(Number);
      return createHexCoordinate(x, y);
    });

    // Filter by minimum range if needed
    if (minRange > 1) {
      return finalResult.filter(coordinate =>
        getDistance(targetPosition, coordinate) >= minRange - 1
      );
    }
    
    return finalResult;
  }
} 