import { HexCoordinate } from "../../../game-versioning/types/HexCoordinate";
import { UnitData } from "../../types/UnitData";
import { MovementRule } from "../types";
import { isHostileUnit } from "../../utils/FactionUtils";

export class GroundMovement implements MovementRule {
    canMoveThrough(
        movingUnit: UnitData,
        current: HexCoordinate,
        target: HexCoordinate,
        units: UnitData[]
    ): boolean {
        const targetUnit = units.find(u => 
            u.position.x === target.x && u.position.y === target.y
        );
        if (!targetUnit) return true;
        
        return !isHostileUnit(movingUnit, targetUnit);
    }

    calculateMovementCost(from: HexCoordinate, to: HexCoordinate): number {
        return 1; // Basic implementation for now
    }
} 