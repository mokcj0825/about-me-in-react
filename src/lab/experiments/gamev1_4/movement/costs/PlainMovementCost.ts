import { MovementType } from "../../types/UnitData";
import { MovementCostProvider } from "../registry/MovementCostRegistry";

export class PlainMovementCost implements MovementCostProvider {
  terrainType = 'plain';

  getMovementCost(movementType: MovementType): number {
    switch (movementType) {
      case 'foot': return 1;
      case 'ooze': return 1;
      case 'float': return 1;
      case 'flying': return 1;
      default: return 99;
    }
  }
} 