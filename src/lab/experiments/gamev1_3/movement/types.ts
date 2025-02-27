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

export type MovementType = 'foot' | 'ooze' | 'float' | 'flying';

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  foot: '步行',
  ooze: '流体',
  float: '浮游',
  flying: '飞行'
};

/**
 * Defines movement costs for different terrain types and movement types
 * Key: terrain type
 * Value: cost for each movement type
 */
export interface MovementCost {
    [terrain: string]: {
        [K in MovementType]: number;
    };
}

export interface MovementRule {
    canMoveThrough: (movingUnit: UnitData, current: HexCoordinate, target: HexCoordinate, units: UnitData[]) => boolean;
    calculateMovementCost: (from: HexCoordinate, to: HexCoordinate) => number;
    getTerrainType: (coordinate: HexCoordinate) => TerrainType;
} 