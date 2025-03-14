import { areCoordinatesEqual, createHexCoordinate, getNeighbors, HexCoordinate } from '../types/HexCoordinate';
import { UnitDirection } from '../types/UnitData';
export type ShapeType = 'area' | 'line' | 'fan' | 'round';

export interface ShapeConfig {
  type: ShapeType;
  minRange: number;
  maxRange: number;
  minEffectRange: number;
  maxEffectRange: number;
}

export class ShapeCalculator {
  // Get selectable area based on weapon configuration
  getSelectableArea(origin: HexCoordinate, config: ShapeConfig): HexCoordinate[] {
    switch (config.type) {
      case 'area':
        return this.getAreaSelection(origin, config.minRange, config.maxRange);
      case 'line':
        return this.getLineSelection(origin, config.minRange, config.maxRange);
      case 'fan':
        return this.getFanSelection(origin, config.minRange, config.maxRange);
      case 'round':
        return this.getRoundSelection(origin, config.minRange, config.maxRange);
      default:
        return [];
    }
  }

  // Get effect area based on selected target and weapon configuration
  getEffectArea(target: HexCoordinate, direction: UnitDirection, config: ShapeConfig): HexCoordinate[] {
    switch (config.type) {
      case 'area':
        return this.getAreaEffect(target, config.minEffectRange, config.maxEffectRange);
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

  // Selection shape implementations
  private getAreaSelection(origin: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
    // Return all hexes within min-max range
    console.log('Calculating area selection from', origin, 'range:', minRange, '-', maxRange);
    const result: HexCoordinate[] = [];
    
    // Start with origin and expand outward
    let currentLayer = [origin];
    let currentDistance = 0;
    
    while (currentDistance <= maxRange) {
      const nextLayer: HexCoordinate[] = [];
      
      // Process each hex in current layer
      currentLayer.forEach(hex => {
        // Add hex if it's within range bounds
        if (currentDistance >= minRange && currentDistance <= maxRange) {
          result.push(hex);
        }
        
        // Get neighbors for next layer
        if (currentDistance < maxRange) {
          getNeighbors(hex).forEach(neighbor => {
            // Check if neighbor is already processed
            if (!result.some(r => r.x === neighbor.x && r.y === neighbor.y)) {
              nextLayer.push(neighbor);
            }
          });
        }
      });
      
      currentLayer = nextLayer;
      currentDistance++;
    }
    console.log('Area selection:', result);
    return result;
  }

  private getLineSelection(origin: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
    // Return line-based selection options
    console.log('Calculating line selection from', origin, 'range:', minRange, '-', maxRange);
    const result: HexCoordinate[] = [];
    
    // Get all possible directions (6 directions in hex grid)
    const directions = getNeighbors(origin);
    
    // For each direction, get hexes in line
    directions.forEach(firstStep => {
      let current = firstStep;
      const direction = {
        x: firstStep.x - origin.x,
        y: firstStep.y - origin.y
      };
      
      let distance = 1;
      while (distance <= maxRange) {
        if (distance >= minRange) {
          result.push(current);
        }
        
        // Move to next hex in line
        current = createHexCoordinate(
          current.x + direction.x,
          current.y + direction.y
        );
        distance++;
      }
    });
    console.log('Line selection:', result);
    return result;
  }

  private getFanSelection(origin: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
    // Return fan-shaped selection options
    console.log('Calculating fan selection from', origin, 'range:', minRange, '-', maxRange);
    const result: HexCoordinate[] = [];
    
    // Get all hexes within range
    const allHexes = this.getAreaSelection(origin, minRange, maxRange);
    
    // For each direction, create a 120-degree fan
    const directions = getNeighbors(origin);
    directions.forEach(dir => {
      const fanCenter = {
        x: dir.x - origin.x,
        y: dir.y - origin.y
      };
      
      // Add hexes that fall within the 120-degree arc
      allHexes.forEach(hex => {
        const relativeX = hex.x - origin.x;
        const relativeY = hex.y - origin.y;
        
        // Use dot product to check if hex is within 120-degree arc
        const dot = fanCenter.x * relativeX + fanCenter.y * relativeY;
        const lenSq = (fanCenter.x * fanCenter.x + fanCenter.y * fanCenter.y) *
                     (relativeX * relativeX + relativeY * relativeY);
        
        if (dot * dot >= lenSq * 0.25) { // cos(120) = -0.5
          result.push(hex);
        }
      });
    });
    console.log('Fan selection:', result);
    return result;
  }

  private getRoundSelection(origin: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
    // Return circular selection options
    console.log('Calculating round selection from', origin, 'range:', minRange, '-', maxRange);
    const result = this.getAreaSelection(origin, minRange, maxRange);
    if (minRange > 0) {
      return result.filter(hex => !areCoordinatesEqual(hex, origin));
    }
    console.log('Round selection:', result);
    return result;
  }

  // Effect shape implementations
  private getAreaEffect(target: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
    // Return area effect hexes
    console.log('Calculating area effect at', target, 'range:', minRange, '-', maxRange);
    return [];  // TODO: Implement
  }

  private getLineEffect(target: HexCoordinate, direction: UnitDirection, minRange: number, maxRange: number): HexCoordinate[] {
    // Return line effect hexes
    console.log('Calculating line effect from', target, 'direction:', direction, 'range:', minRange, '-', maxRange);
    return [];  // TODO: Implement
  }

  private getFanEffect(target: HexCoordinate, direction: UnitDirection, minRange: number, maxRange: number): HexCoordinate[] {
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
