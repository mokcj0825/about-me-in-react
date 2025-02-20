import { HexCoordinate } from "../../types/HexCoordinate";
import { UnitData } from "../../types/UnitData";
import { MovementRule } from "../types";
import { isHostileUnit } from "../../utils/FactionUtils";
import type { TerrainType } from '../types'
import mapData from '../../data/map-data.json'

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

    getTerrainType(coord: HexCoordinate): TerrainType {
        return mapData.terrain[coord.y][coord.x] as TerrainType;
    }
} 