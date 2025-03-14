import { MovementType } from "../../types/UnitData";
import { MovementCostProvider } from "../registry/MovementCostRegistry";

export class RiverMovementCost implements MovementCostProvider {
  terrainType = 'river';

  getMovementCost(movementType: MovementType): number {
    switch (movementType) {
      case 'foot': return 2;
      case 'ooze': return 1;
      case 'float': return 1;
      case 'flying': return 1;
      default: return 99;
    }
  }
} 