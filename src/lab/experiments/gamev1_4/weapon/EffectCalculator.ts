import { HexCoordinate } from "../types/HexCoordinate";
import { ShapeCalculator, ShapeConfig } from "./ShapeCalculator";
import { RoundEffect } from "./effect/RoundEffect";
import { LineEffect } from "./effect/LineEffect";
import { FanEffect } from "./effect/FanEffect";

export class EffectCalculator extends ShapeCalculator {

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
        return RoundEffect.getEffectArea(unitPosition, targetPosition, config.minEffectRange, config.maxEffectRange);
      case 'line':
        return LineEffect.getEffectArea(unitPosition, targetPosition, config.minEffectRange, config.maxEffectRange);
      case 'fan':
        return FanEffect.getEffectArea(unitPosition, targetPosition, config.minEffectRange, config.maxEffectRange);
      default:
        return [];
    }
  }

}

