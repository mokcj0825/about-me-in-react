import { HexCoordinate } from "../../game-versioning/types/HexCoordinate";
import { UnitData } from "../types/UnitData";

export interface MovementRule {
    canMoveThrough: (movingUnit: UnitData, current: HexCoordinate, target: HexCoordinate, units: UnitData[]) => boolean;
    calculateMovementCost: (from: HexCoordinate, to: HexCoordinate) => number;
} 