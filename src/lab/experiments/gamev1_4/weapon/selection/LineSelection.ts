import { getNextCoordinate } from "../../types/HexCoordinate";
import { ISelection } from "./ISelection";
import { HexCoordinate } from "../../../game-versioning/types/HexCoordinate";
import { UnitDirection } from "../../../game-versioning/types/UnitDirection";

/**
 * Implementation of line area selection
 */
export class LineSelection extends ISelection {
  /**
   * Helper to determine direction based on relative position
   */
  private static getDirectionFromDelta(
    dx: number,
    dy: number,
    isUnitYEven: boolean
  ): UnitDirection {
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
   * Get all coordinates in a line in the specified direction
   */
  private static getLineInDirection(
    origin: HexCoordinate,
    direction: UnitDirection,
    minRange: number,
    maxRange: number
  ): HexCoordinate[] {
    const result: HexCoordinate[] = [];
    let current = origin;
    let distance = 0;
    
    while (distance < maxRange) {
      current = getNextCoordinate(current, direction);
      distance++;
      
      if (this.isValidCoordinate(current) && distance >= minRange) {
        result.push(current);
      }
    }

    return result;
  }

  static override getSelectionArea(
    unitPosition: HexCoordinate,
    minRange: number,
    maxRange: number
  ): HexCoordinate[] {
    const result: HexCoordinate[] = [];
    const isUnitYEven = unitPosition.y % 2 === 0;

    // Calculate lines in all six directions
    const directions: [number, number][] = [
      [1, 0],    // right
      [1, 1],    // top-right
      [-1, 1],   // top-left
      [-1, 0],   // left
      [-1, -1],  // bottom-left
      [1, -1]    // bottom-right
    ];

    for (const [dx, dy] of directions) {
      const direction = this.getDirectionFromDelta(dx, dy, isUnitYEven);
      const lineCoords = this.getLineInDirection(unitPosition, direction, minRange, maxRange);
      result.push(...lineCoords);
    }

    return result;
  }
} 