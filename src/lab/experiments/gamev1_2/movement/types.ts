import { HexCoordinate } from "../types/HexCoordinate";
import { UnitData } from "../types/UnitData";

export type TerrainType = 
    | 'plain'
    | 'road'
    | 'forest'
    | 'cliff'
    | 'mountain'
    | 'wasteland'
    | 'ruins'
    | 'river'
    | 'swamp'
    | 'sea';

export interface MovementRule {
    canMoveThrough: (movingUnit: UnitData, current: HexCoordinate, target: HexCoordinate, units: UnitData[]) => boolean;
    calculateMovementCost: (from: HexCoordinate, to: HexCoordinate) => number;
    getTerrainType: (coordinate: HexCoordinate) => TerrainType;
} 