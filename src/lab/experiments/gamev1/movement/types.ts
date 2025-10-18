import { UnitData } from "../types/UnitData";
import { HexCoordinate } from "../../game-versioning/types/HexCoordinate";

export interface MovementRule {
    canMoveThrough: (movingUnit: UnitData, current: HexCoordinate, target: HexCoordinate, units: UnitData[]) => boolean;
    calculateMovementCost: (from: HexCoordinate, to: HexCoordinate) => number;
} 