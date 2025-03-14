import { HexCoordinate } from "../../types/HexCoordinate";
import { UnitData } from "../../types/UnitData";
import { MovementRule } from "../types";
import type { TerrainType } from '../types'
import mapData from '../../data/map-data.json'

export class AirMovement implements MovementRule {
    canMoveThrough(
        movingUnit: UnitData,
        from: HexCoordinate,
        to: HexCoordinate,
        units: UnitData[]
    ): boolean {
        // Check terrain passability
        const terrainType = this.getTerrainType(to);
        if (!terrainType) return false;

        // Find units at target position (excluding the moving unit itself)
        const unitsAtTarget = units.filter(u => 
            u.position.x === to.x && 
            u.position.y === to.y &&
            u.id !== movingUnit.id
        );

        // Empty hex is always valid
        if (unitsAtTarget.length === 0) return true;

        // Check for hostile units
        if (unitsAtTarget.some(u => u.faction !== movingUnit.faction)) return false;

        // Check for friendly air unit (can't stack with another air)
        const hasFriendlyAir = unitsAtTarget.some(u => 
            u.faction === movingUnit.faction && 
            u.movementType === 'flying'
        );
        
        return !hasFriendlyAir;
    }

    getTerrainType(coord: HexCoordinate): TerrainType {
        return mapData.terrain[coord.y][coord.x] as TerrainType;
    }
} 