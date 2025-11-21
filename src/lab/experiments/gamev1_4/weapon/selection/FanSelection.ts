import { getNextCoordinate } from "../../types/HexCoordinate";
import { ISelection } from "./ISelection";
import { createHexCoordinate, getDistance, HexCoordinate } from "../../../game-versioning/types/HexCoordinate";
import { UnitDirection } from "../../../game-versioning/types/UnitDirection";

/**
 * Implementation of fan-shaped area selection
 */
export class FanSelection extends ISelection {

  static override getSelectionArea(
    unitPosition: HexCoordinate,
    minRange: number,
    maxRange: number
  ): HexCoordinate[] {
    const result: Set<string> = new Set(); // Use Set to handle duplicates
    
    // For each main direction
    const DIRECTIONS: UnitDirection[] = [
      'right',
      'bottom-right',
      'bottom-left',
      'left',
      'top-left',
      'top-right'
    ];

    for (let mainIndex = 0; mainIndex < DIRECTIONS.length; mainIndex++) {
      const mainDirection = DIRECTIONS[mainIndex];
      const leftSide = DIRECTIONS[(mainIndex + 5) % 6]; // +5 is same as -1
      const rightSide = DIRECTIONS[(mainIndex + 1) % 6];

      // Helper function to add a coordinate if valid
      const addCoord = (coord: HexCoordinate) => {
        if (this.isValidCoordinate(coord)) {
          result.add(`${coord.x},${coord.y}`);
        }
      };

      // Helper function to get next hex in a direction
      const getNextHex = (pos: HexCoordinate, dir: UnitDirection): HexCoordinate => {
        return getNextCoordinate(pos, dir);
      };

      let currentHexes = [unitPosition];

      // For each range step
      for (let range = 0; range < maxRange; range++) {
        const nextHexes: HexCoordinate[] = [];

        // For each current hex
        for (const hex of currentHexes) {
          // For each direction in the fan
          [mainDirection, leftSide, rightSide].forEach(dir => {
            const nextHex = getNextHex(hex, dir);
            const distance = getDistance(unitPosition, nextHex);
            if (this.isValidCoordinate(nextHex) && distance >= minRange && distance <= maxRange) {
              addCoord(nextHex);
              nextHexes.push(nextHex);
            }
          });
        }

        currentHexes = nextHexes;
      }
    }

    // Convert back to coordinates
    return Array.from(result).map(key => {
      const [x, y] = key.split(',').map(Number);
      return createHexCoordinate(x, y);
    });
  }
} 