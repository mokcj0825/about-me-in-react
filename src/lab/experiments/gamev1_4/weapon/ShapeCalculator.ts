import { HexCoordinate } from '../types/HexCoordinate';

/**
 * Configuration for shape calculations
 */
export interface ShapeConfig {
  type: 'round' | 'line' | 'fan';
  minEffectRange: number;
  maxEffectRange: number;
  minSelectRange: number;
  maxSelectRange: number;
}

/**
 * Base class for shape calculations
 */
export abstract class ShapeCalculator {
  /**
   * Get all coordinates that can be selected for a weapon
   * @param unitPosition - Position of the unit using the weapon
   * @param config - Weapon selection configuration
   */
  public static getArea(
    unitPosition: HexCoordinate,
    config: ShapeConfig
  ): HexCoordinate[] {
    throw new Error('getArea must be implemented by derived classes');
  }
}
