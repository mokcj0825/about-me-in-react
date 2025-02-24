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

/**
 * Defines movement costs for different terrain types and movement types
 * Key: terrain type
 * Value: cost for each movement type
 */
export interface MovementCost {
    [key: string]: {
        foot: number;   // Standard ground movement
        ooze: number;   // Slime/liquid movement
        float: number;  // Hovering movement
        flying: number; // Aerial movement
    };
}

export interface MovementRule {
    canMoveThrough: (movingUnit: UnitData, current: HexCoordinate, target: HexCoordinate, units: UnitData[]) => boolean;
    calculateMovementCost: (from: HexCoordinate, to: HexCoordinate) => number;
    getTerrainType: (coordinate: HexCoordinate) => TerrainType;
} 