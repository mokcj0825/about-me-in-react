import { MovementType } from "../../types/UnitData";
import { MovementCostProvider } from "../registry/MovementCostRegistry";

export class SwampMovementCost implements MovementCostProvider {
  terrainType = 'swamp';

  getMovementCost(movementType: MovementType): number {
    switch (movementType) {
      case 'foot': return 3;
      case 'ooze': return 1;
      case 'float': return 2;
      case 'flying': return 1;
      default: return 99;
    }
  }
} 