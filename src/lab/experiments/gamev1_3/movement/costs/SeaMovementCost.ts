import { MovementType } from "../../types/UnitData";
import { MovementCostProvider } from "../registry/MovementCostRegistry";

export class SeaMovementCost implements MovementCostProvider {
  terrainType = 'sea';

  getMovementCost(movementType: MovementType): number {
    switch (movementType) {
      case 'foot': return 99;
      case 'ooze': return 2;
      case 'float': return 1;
      case 'flying': return 1;
      default: return 99;
    }
  }
} 