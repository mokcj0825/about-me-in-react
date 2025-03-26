import { HexCoordinate } from '../types/HexCoordinate';
import {SelectionCalculator} from "./SelectionCalculator";
export type ShapeType = 'line' | 'fan' | 'round';

export interface ShapeConfig {
  type: ShapeType;
  minRange: number;
  maxRange: number;
  minEffectRange: number;
  maxEffectRange: number;
}

export class ShapeCalculator {

  private selectionCalculator = new SelectionCalculator();

  getSelectableArea(origin: HexCoordinate, config: ShapeConfig): HexCoordinate[] {
    switch (config.type) {
      case 'line':
        return this.selectionCalculator.getLineSelection(origin, config.minRange, config.maxRange);
      case 'fan':
        return this.selectionCalculator.getFanSelection(origin, config.minRange, config.maxRange);
      case 'round':
        return this.selectionCalculator.getRoundSelection(origin, config.minRange, config.maxRange);
      default:
        return [];
    }
  }

}
