import { HexCoordinate } from "../../types/HexCoordinate";
import { UnitData } from "../../types/UnitData";
import { MovementRule } from "../types";
import type { TerrainType } from '../types'
import mapData from '../../data/map-data.json'

/**
 * GroundMovement class - Implements basic ground movement rules for units
 * 
 * This class defines how ground-based units can move through the hex grid:
 * - Units can move through empty cells
 * - Units can move through friendly units
 * - Units cannot move through hostile units
 * - Units with different movement types can stack (e.g., ground and flying)
 */
export class GroundMovement implements MovementRule {
    /**
     * Determines if a unit can move through a specific cell
     * 
     * @param movingUnit - The unit attempting to move
     * @param from - Starting hex coordinate
     * @param to - Destination hex coordinate to check
     * @param units - Array of all units on the map
     * @returns boolean - True if movement is allowed, false if blocked
     * 
     * Movement is blocked if:
     * - There is a hostile unit in the target cell
     * Movement is allowed if:
     * - The cell is empty
     * - The cell contains a friendly unit
     */
    canMoveThrough(
        movingUnit: UnitData,
        from: HexCoordinate,
        to: HexCoordinate,
        units: UnitData[]
    ): boolean {
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

        // Check for hostile units - cannot move through them
        const hasHostileUnit = unitsAtTarget.some(u => 
            (movingUnit.faction === 'enemy' && u.faction !== 'enemy') ||
            (movingUnit.faction !== 'enemy' && u.faction === 'enemy')
        );
        if (hasHostileUnit) return false;

        // Always allow moving through (stacking rules are handled by MovementCalculator)
        return true;
    }

    /**
     * Gets the terrain type at a specific coordinate
     * 
     * @param coord - The coordinate to check
     * @returns TerrainType - The type of terrain at the coordinate
     * 
     * Used for:
     * - Movement cost calculations
     * - Terrain effect application
     * - Pathfinding decisions
     */
    getTerrainType(coord: HexCoordinate): TerrainType {
        return mapData.terrain[coord.y][coord.x] as TerrainType;
    }
} 