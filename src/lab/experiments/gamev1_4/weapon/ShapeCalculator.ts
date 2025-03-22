import { areCoordinatesEqual, getNeighbors, getNextCoordinate, HexCoordinate } from '../types/HexCoordinate';
import mapData from '../data/map-data.json';
import { DirectionData } from '../types/DirectionData';
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

  private isValidCoordinate(coord: HexCoordinate): boolean {
    return coord.x >= 0 && coord.x < mapData.width && 
           coord.y >= 0 && coord.y < mapData.height;
  }

  // Get selectable area based on weapon configuration
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

  // Get effect area based on selected target and weapon configuration
  getEffectArea(target: HexCoordinate, direction: DirectionData, config: ShapeConfig): HexCoordinate[] {
    switch (config.type) {
      case 'line':
        return this.getLineEffect(target, direction, config.minEffectRange, config.maxEffectRange);
      case 'fan':
        return this.getFanEffect(target, direction, config.minEffectRange, config.maxEffectRange);
      case 'round':
        return this.getRoundEffect(target, config.minEffectRange, config.maxEffectRange);
      default:
        return [];
    }
  }


  // Effect shape implementations
  private getAreaEffect(target: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
    // Return area effect hexes
    console.log('Calculating area effect at', target, 'range:', minRange, '-', maxRange);
    return [];  // TODO: Implement
  }

  private getLineEffect(target: HexCoordinate, direction: DirectionData, minRange: number, maxRange: number): HexCoordinate[] {
    // Return line effect hexes
    console.log('Calculating line effect from', target, 'direction:', direction, 'range:', minRange, '-', maxRange);
    return [];  // TODO: Implement
  }

  private getFanEffect(target: HexCoordinate, direction: DirectionData, minRange: number, maxRange: number): HexCoordinate[] {
    // Return fan effect hexes
    console.log('Calculating fan effect from', target, 'direction:', direction, 'range:', minRange, '-', maxRange);
    return [];  // TODO: Implement
  }

  private getRoundEffect(target: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
    // Return circular effect hexes
    console.log('Calculating round effect at', target, 'range:', minRange, '-', maxRange);
    return [];  // TODO: Implement
  }
}
