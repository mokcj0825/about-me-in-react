import { HexCoordinate, createHexCoordinate, getNeighbors } from "../types/HexCoordinate";
import { UnitData, MovementType } from "../types/UnitData";
import { MovementRule } from "./types";
import { ZoneOfControl } from "../zoc/types";
import { isHostileUnit } from "../utils/FactionUtils";
import { hasCharacteristic } from "../types/Characteristics";
import { DEFAULT_MOVEMENT_COSTS } from "./constants";

/**
 * Defines movement costs for different terrain types and movement types
 * Key: terrain type
 * Value: cost for each movement type (foot, ooze, float, flying)
 */
export interface MovementCost {
    [key: string]: {
        foot: number;   // Standard ground movement
        ooze: number;   // Slime/liquid movement
        float: number;  // Hovering movement
        flying: number; // Aerial movement
    };
}


/**
 * MovementCalculator class - Handles movement calculations and pathfinding
 * 
 * This class is responsible for:
 * 1. Calculating movement costs based on terrain and unit type
 * 2. Finding all reachable hexes within a unit's movement range
 * 3. Handling special movement rules (ZoC, characteristics)
 */
export class MovementCalculator {
    constructor(
        private movementRule: MovementRule,
        private zocRules: ZoneOfControl[]
    ) {}

    /**
     * Calculates the movement cost for a specific terrain and movement type
     * Applies special characteristics like 'amphibious' that modify costs
     */
    getMovementCost(terrainType: string, movementType: MovementType, unit?: UnitData): number {
        const costs = DEFAULT_MOVEMENT_COSTS[terrainType] || DEFAULT_MOVEMENT_COSTS['plain'];
        let cost = costs[movementType];

        // Apply amphibious characteristic if unit has it
        if (unit && hasCharacteristic(unit.characteristics, unit.buffs, 'amphibious')) {
            switch (terrainType) {
                case 'river':
                case 'swamp':
                    cost = Math.min(cost, 1);  // Water terrain becomes normal
                    break;
                case 'sea':
                    cost = Math.min(cost, 2);  // Deep water becomes difficult but passable
                    break;
            }
        }

        return cost;
    }

    /**
     * Finds all hexes that a unit can move to within its movement range
     * Uses a breadth-first search algorithm with movement costs
     */
    getMoveableGrids(startCoord: HexCoordinate, movement: number, units: UnitData[]): HexCoordinate[] {
        const result = new Set<string>();
        const visited = new Map<string, number>();
        
        // Find the moving unit
        const movingUnit = units.find(u => 
            u.position.x === startCoord.x && u.position.y === startCoord.y
        );
        if (!movingUnit) return [];

        // Check if unit is affected by Zones of Control
        const isAffectedByZOC = this.zocRules.some(rule => rule.affectsUnit(movingUnit));
        const opposingZOC = isAffectedByZOC ? this.getOpposingZOC(movingUnit, units) : [];
        
        // Initialize search queue with start position
        const queue: [HexCoordinate, number][] = [
            [startCoord, movement]
        ];
        
        while (queue.length > 0) {
            const [current, remainingMove] = queue.shift()!;
            const currentKey = `${current.x},${current.y}`;
            
            if (remainingMove >= 0) {
                result.add(currentKey);
                
                if (remainingMove > 0) {
                    const neighbors = getNeighbors(current);
                    
                    for (const neighbor of neighbors) {
                        if (!this.movementRule.canMoveThrough(movingUnit, current, neighbor, units)) continue;
                        
                        const newRemainingMove = this.calculateRemainingMove(
                            current,
                            neighbor,
                            remainingMove,
                            isAffectedByZOC,
                            opposingZOC,
                            movingUnit
                        );
                        
                        if (newRemainingMove >= 0) {
                            const neighborKey = `${neighbor.x},${neighbor.y}`;
                            const existingMove = visited.get(neighborKey);
                            
                            if (existingMove === undefined || newRemainingMove > existingMove) {
                                visited.set(neighborKey, newRemainingMove);
                                queue.push([neighbor, newRemainingMove]);
                            }
                        }
                    }
                }
            }
        }

        return Array.from(result).map(key => {
            const [x, y] = key.split(',').map(Number);
            return createHexCoordinate(x, y);
        });
    }

    /**
     * Calculates remaining movement points after moving to a new hex
     * Takes into account:
     * - Terrain costs
     * - Zone of Control effects
     * - Unit characteristics
     */
    calculateRemainingMove(
        current: HexCoordinate,
        neighbor: HexCoordinate,
        remainingMove: number,
        isAffectedByZOC: boolean,
        opposingZOC: HexCoordinate[],
        movingUnit: UnitData
    ): number {
        // Flying units ignore ZOC
        if (hasCharacteristic(movingUnit.characteristics, movingUnit.buffs || [], 'flying')) {
            const terrainType = this.movementRule.getTerrainType(neighbor);
            return remainingMove - this.getMovementCost(terrainType, movingUnit.movementType, movingUnit);
        }

        // Handle ZOC rules for non-flying units
        if (isAffectedByZOC) {
            const currentInZOC = opposingZOC.some(zoc => 
                zoc.x === current.x && zoc.y === current.y
            );
            const neighborInZOC = opposingZOC.some(zoc => 
                zoc.x === neighbor.x && zoc.y === neighbor.y
            );
            
            // Cannot move from one ZOC to another
            if (currentInZOC && neighborInZOC) {
                return -1; // Movement not allowed
            }

            // Moving into ZOC stops movement
            if (neighborInZOC) {
                return 0;
            }

            // When starting in ZOC, can only move to non-ZOC hexes in specific directions
            if (currentInZOC) {
                // Get the direction from current to neighbor
                const dx = neighbor.x - current.x;
                const dy = neighbor.y - current.y;
                
                // Check if any enemy unit is in the direction we're trying to move
                const hasEnemyInDirection = opposingZOC.some(zoc => {
                    const zocDx = zoc.x - current.x;
                    const zocDy = zoc.y - current.y;
                    // If enemy is in same general direction, movement is blocked
                    return Math.sign(dx) === Math.sign(zocDx) && 
                           Math.sign(dy) === Math.sign(zocDy);
                });

                if (hasEnemyInDirection) {
                    return -1; // Movement blocked in this direction
                }
                
                // Allow movement in directions away from enemy ZOC
                const terrainType = this.movementRule.getTerrainType(neighbor);
                return remainingMove - this.getMovementCost(terrainType, movingUnit.movementType, movingUnit);
            }
        }

        // Normal movement cost calculation
        const terrainType = this.movementRule.getTerrainType(neighbor);
        return remainingMove - this.getMovementCost(terrainType, movingUnit.movementType, movingUnit);
    }

    /**
     * Gets all hexes that are in the Zone of Control of opposing units
     */
    getOpposingZOC(movingUnit: UnitData, units: UnitData[]): HexCoordinate[] {
        const hostileUnits = units.filter(u => isHostileUnit(movingUnit, u));
        const zocHexes = hostileUnits.flatMap(u => 
            this.zocRules.flatMap(rule => rule.getControlledArea(u.position))
        );

        // Remove duplicates
        return zocHexes.filter((hex, index, self) =>
            index === self.findIndex((h) => h.x === hex.x && h.y === hex.y)
        );
    }
} 