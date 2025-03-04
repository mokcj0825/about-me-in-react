import { HexCoordinate } from "../../types/HexCoordinate";
import { UnitData } from "../../types/UnitData";
import { MovementRule } from "../types";
import { isHostileUnit } from "../../utils/FactionUtils";
import type { TerrainType } from '../types'
import mapData from '../../data/map-data.json'
import { hasCharacteristic } from "../../types/Characteristics";

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
        // Check terrain passability
        const terrainType = this.getTerrainType(to);
        if (!terrainType) return false;

        // Find units at target position
        const unitsAtTarget = units.filter(u => 
            u.position.x === to.x && u.position.y === to.y
        );

        // If no units at target, movement is allowed
        if (unitsAtTarget.length === 0) return true;

        // Flying units can pass through ground units and vice versa
        const isMovingUnitFlying = hasCharacteristic(
            movingUnit.characteristics,
            movingUnit.buffs || [],
            'flying'
        );

        // Allow passing through friendly units
        const hasFriendlyUnits = unitsAtTarget.every(u => u.faction === movingUnit.faction);
        if (hasFriendlyUnits) return true;

        // For enemy units, maintain flying vs ground rules
        const hasTargetFlying = unitsAtTarget.some(u => 
            hasCharacteristic(u.characteristics, u.buffs || [], 'flying')
        );

        return isMovingUnitFlying 
            ? !hasTargetFlying  // Flying units can't pass through flying units
            : unitsAtTarget.every(u =>  // Ground units can't pass through ground units
                hasCharacteristic(u.characteristics, u.buffs || [], 'flying')
            );
    }

    /**
     * Calculates the movement cost for moving between hexes
     * 
     * @param from - Starting hex coordinate
     * @param to - Destination hex coordinate
     * @returns number - Movement cost (currently simplified to 1)
     * 
     * TODO: Implement terrain-based movement costs:
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