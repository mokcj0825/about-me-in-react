import { HexCoordinate } from "../../types/HexCoordinate";
import { UnitData } from "../../types/UnitData";
import { MovementRule } from "../types";
import { isHostileUnit } from "../../utils/FactionUtils";
import type { TerrainType } from '../types'
import mapData from '../../data/map-data.json'

/**
 * GroundMovement class - Implements basic ground movement rules for units
 * 
 * This class defines how ground-based units can move through the hex grid:
 * - Units can move through empty cells
 * - Units can move through friendly units
 * - Units cannot move through hostile units
 * - Each cell has a movement cost (currently simplified to 1)
 * 
 * @implements {MovementRule}
 */
export class GroundMovement implements MovementRule {
    /**
     * Determines if a unit can move through a specific cell
     * 
     * @param movingUnit - The unit attempting to move
     * @param current - Current hex coordinate
     * @param target - Target hex coordinate to check
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
        current: HexCoordinate,
        target: HexCoordinate,
        units: UnitData[]
    ): boolean {
        // Find if there's a unit at the target location
        const targetUnit = units.find(u => 
            u.position.x === target.x && u.position.y === target.y
        );
        
        // Allow movement if no unit present
        if (!targetUnit) return true;
        
        // Allow movement through friendly units, block hostile units
        return !isHostileUnit(movingUnit, targetUnit);
    }

    /**
     * Calculates the movement cost for moving between hexes
     * 
     * @param from - Starting hex coordinate
     * @param to - Destination hex coordinate
     * @returns number - Movement cost (currently simplified to 1)
     *
     * - Plains: 1 movement point
     * - Forest: 2 movement points
     * - Mountains: 3 movement points
     * - Roads: 0.5 movement points
     */
    calculateMovementCost(from: HexCoordinate, to: HexCoordinate): number {
        return 1; // Basic implementation for now
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