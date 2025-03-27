import { HexCoordinate } from "../../types/HexCoordinate";
import mapData from '../../data/map-data.json';

/**
 * Base class for weapon selection calculations
 */
export abstract class ISelection {
  /**
   * Check if a coordinate is within map boundaries
   */
  protected static isValidCoordinate(coord: HexCoordinate): boolean {
    return coord.x >= 0 && coord.x < mapData.width &&
      coord.y >= 0 && coord.y < mapData.height;
  }

  /**
   * Calculate the area that can be selected for this weapon
   * @param unitPosition - Position of the unit using the weapon
   * @param minRange - Minimum range of the selection
   * @param maxRange - Maximum range of the selection
   * @returns Array of coordinates that can be selected
   */
  static getSelectionArea(
    unitPosition: HexCoordinate,
    minRange: number,
    maxRange: number
  ): HexCoordinate[] {
    throw new Error('getSelectionArea must be implemented by derived classes');
  }
} 