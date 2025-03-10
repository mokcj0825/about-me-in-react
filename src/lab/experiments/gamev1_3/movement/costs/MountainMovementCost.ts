import { MovementType } from "../../types/UnitData";
import { MovementCostProvider } from "../registry/MovementCostRegistry";

export class MountainMovementCost implements MovementCostProvider {
  terrainType = 'mountain';

  getMovementCost(movementType: MovementType): number {
    switch (movementType) {
      case 'foot': return 3;
      case 'ooze': return 99;
      case 'float': return 99;
      case 'flying': return 1;
      default: return 99;
    }
  }
} 