import { HexCoordinate, getNextCoordinate } from "../../types/HexCoordinate";
import { BaseEffect } from "./IEffect";

/**
 * Implementation of line area effect
 */
export class LineEffect extends BaseEffect {

  static override getEffectArea(
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
} 