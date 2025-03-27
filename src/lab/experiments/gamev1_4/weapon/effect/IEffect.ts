import { HexCoordinate } from "../../types/HexCoordinate";
import mapData from '../../data/map-data.json';
import {DirectionData} from "../../types/DirectionData";

/**
 * Base class for weapon effect calculations
 */
export abstract class BaseEffect {
  /**
   * Check if a coordinate is within map boundaries
   */
  protected static isValidCoordinate(coord: HexCoordinate): boolean {
    return coord.x >= 0 && coord.x < mapData.width &&
      coord.y >= 0 && coord.y < mapData.height;
  }

  /**
   * Helper to determine direction based on relative position
   */
  protected static getDirectionFromDelta(
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
   * Calculate the area affected by this effect
   * @param unitPosition - Position of the unit using the weapon
   * @param targetPosition - Position where the effect is centered
   * @param minRange - Minimum range of the effect
   * @param maxRange - Maximum range of the effect
   * @returns Array of coordinates affected by the effect
   */
  static getEffectArea(
    unitPosition: HexCoordinate,
    targetPosition: HexCoordinate,
    minRange: number,
    maxRange: number
  ): HexCoordinate[] {
    throw new Error('getEffectArea must be implemented by derived classes');
  }
} 