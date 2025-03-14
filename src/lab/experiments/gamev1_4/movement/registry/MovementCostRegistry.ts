import { MovementType } from "../../types/UnitData";

export interface MovementCostProvider {
  terrainType: string;
  getMovementCost(movementType: MovementType): number;
}

class MovementCostRegistry {
  private providers: MovementCostProvider[] = [];

  register(provider: MovementCostProvider) {
    this.providers.push(provider);
  }

  getMovementCost(terrainType: string, movementType: MovementType): number {
    const provider = this.providers.find(p => p.terrainType === terrainType);
    return provider?.getMovementCost(movementType) ?? 99; // Default to impassable
  }
}

export const movementCostRegistry = new MovementCostRegistry(); 