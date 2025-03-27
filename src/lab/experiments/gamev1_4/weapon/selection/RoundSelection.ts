import { HexCoordinate, createHexCoordinate, getNextCoordinate } from "../../types/HexCoordinate";
import { ALL_DIRECTIONS } from "../../types/DirectionData";
import { ISelection } from "./ISelection";

/**
 * Implementation of circular/round area selection
 */
export class RoundSelection extends ISelection {
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

  static override getSelectionArea(
    unitPosition: HexCoordinate,
    minRange: number,
    maxRange: number
  ): HexCoordinate[] {
    // Special case for self-targeting
    if (minRange === 0 && maxRange === 0) {
      return [unitPosition];
    }

    return this.getGridsWithinRange(unitPosition, minRange, maxRange);
  }
} 