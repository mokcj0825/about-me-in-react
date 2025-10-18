import { HexCoordinate } from "../../game-versioning/types/HexCoordinate";
import { UnitData } from "../types/UnitData";

export interface MovementRule {
    canMoveThrough: (movingUnit: UnitData, from: HexCoordinate, to: HexCoordinate, units: UnitData[]) => boolean;
    getTerrainType: (coord: HexCoordinate) => string;
}

export type TerrainType = 'plain' | 'mountain' | 'forest' | 'sea' | 'river' | 'cliff' | 'road' | 'wasteland' | 'ruins' | 'swamp';

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