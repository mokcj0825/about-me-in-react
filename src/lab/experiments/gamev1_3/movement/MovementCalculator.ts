import { HexCoordinate, createHexCoordinate, getNeighbors } from "../types/HexCoordinate";
import { UnitData, MovementType } from "../types/UnitData";
import { MovementRule } from "./types";
import { ZoneOfControl } from "../zoc/types";
import { isHostileUnit } from "../utils/FactionUtils";
import { hasCharacteristic } from "../types/Characteristics";
import { movementCostRegistry } from './registry/MovementCostRegistry';
import { buffRegistry } from '../buffs/registry/BuffRegistry';

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
        let cost = movementCostRegistry.getMovementCost(terrainType, movementType);
        
        if (unit) {
            buffRegistry.calculateStats(unit);
        }
        
        return cost;
    }

    /**
     * Finds all hexes that a unit can move to within its movement range
     * Uses a breadth-first search algorithm with movement costs
     */
    getMoveableGrids(
        position: HexCoordinate,
        movement: number,
        units: UnitData[]
    ): HexCoordinate[] {
        const moveableGrids: HexCoordinate[] = [];
        
        const movingUnit = units.find(u => 
            u.position.x === position.x && 
            u.position.y === position.y
        )!;

        if (movingUnit.movementType === 'flying') {
            const visited = new Set<string>();
            const queue: [HexCoordinate, number][] = [[position, movement]];
            
            while (queue.length > 0) {
                const [current, remainingMovement] = queue.shift()!;
                const key = `${current.x},${current.y}`;

                if (visited.has(key)) continue;
                visited.add(key);

                if (current.x !== position.x || current.y !== position.y) {
                    moveableGrids.push(current);
                }

                if (remainingMovement <= 0) continue;

                const neighbors = getNeighbors(current);
                for (const neighbor of neighbors) {
                    const neighborKey = `${neighbor.x},${neighbor.y}`;
                    if (visited.has(neighborKey)) continue;

                    if (!this.movementRule.canMoveThrough(movingUnit, current, neighbor, units)) {
                        continue;
                    }

                    const terrainType = this.movementRule.getTerrainType(neighbor);
                    const cost = this.getMovementCost(terrainType, movingUnit.movementType, movingUnit);
                    const newRemainingMovement = remainingMovement - cost;

                    if (newRemainingMovement >= 0) {
                        queue.push([neighbor, newRemainingMovement]);
                    }
                }
            }
        } else {
            const enemyZOC = this.getEnemyZOC(movingUnit, units);
            
            const startInZOC = enemyZOC.some(zoc => 
                zoc.x === position.x && zoc.y === position.y
            );
            
            const visited = new Set<string>();
            visited.add(`${position.x},${position.y}`);
            
            const queue: [HexCoordinate, number][] = [[position, movement]];
            
            while (queue.length > 0) {
                const [current, remainingMovement] = queue.shift()!;
                console.log('\nProcessing hex:', current, 'with remaining movement:', remainingMovement);
                
                if (remainingMovement <= 0) {
                    console.log('No movement points left, skipping');
                    continue;
                }
                
                const neighbors = getNeighbors(current);
                console.log('Neighbors:', neighbors);
                
                for (const neighbor of neighbors) {
                    const neighborKey = `${neighbor.x},${neighbor.y}`;
                    console.log('\nChecking neighbor:', neighbor);
                    
                    if (visited.has(neighborKey)) {
                        console.log('Already visited, skipping');
                        continue;
                    }

                    if (!this.movementRule.canMoveThrough(movingUnit, current, neighbor, units)) {
                        console.log('Cannot move through this hex, skipping');
                        continue;
                    }
                    
                    const terrainType = this.movementRule.getTerrainType(neighbor);
                    const cost = this.getMovementCost(terrainType, movingUnit.movementType, movingUnit);
                    let newRemainingMovement = remainingMovement - cost;
                    
                    console.log('Movement cost:', cost);
                    console.log('New remaining movement before ZOC:', newRemainingMovement);
                    
                    if (newRemainingMovement < 0) {
                        console.log('Not enough movement points, skipping');
                        continue;
                    }
                    
                    const isInEnemyZOC = enemyZOC.some(zoc => 
                        zoc.x === neighbor.x && zoc.y === neighbor.y
                    );
                    console.log('Is neighbor in enemy ZOC:', isInEnemyZOC);
                    
                    if (isInEnemyZOC) {
                        console.log('Entering enemy ZOC, consuming all movement');
                        newRemainingMovement = 0;
                    }
                    
                    moveableGrids.push({
                        x: neighbor.x,
                        y: neighbor.y,
                        z: neighbor.z
                    });
                    console.log('Added to moveable grids');
                    
                    visited.add(neighborKey);
                    
                    if (newRemainingMovement > 0) {
                        console.log('Adding to queue with remaining movement:', newRemainingMovement);
                        queue.push([neighbor, newRemainingMovement]);
                    } else {
                        console.log('No movement left, not adding to queue');
                    }
                }
            }
        }

        return moveableGrids;
    }

    private getEnemyZOC(unit: UnitData, units: UnitData[]): HexCoordinate[] {
        const enemyUnits = units.filter(u => 
            (u.faction === 'enemy') && // Only enemy faction units, not ally
            u.movementType !== 'flying'   // Only ground units
        );
        
        console.log('Enemy units for ZOC:', enemyUnits);
        
        const zocHexes: HexCoordinate[] = [];
        for (const enemy of enemyUnits) {
            const neighbors = getNeighbors(enemy.position);
            for (const neighbor of neighbors) {
                zocHexes.push({
                    x: neighbor.x,
                    y: neighbor.y,
                    z: neighbor.z
                });
            }
        }

        console.log('ZOC hexes before deduplication:', zocHexes);

        const uniqueKeys = new Set<string>();
        const uniqueZocHexes: HexCoordinate[] = [];
        
        for (const hex of zocHexes) {
            const key = `${hex.x},${hex.y}`;
            if (!uniqueKeys.has(key)) {
                uniqueKeys.add(key);
                uniqueZocHexes.push(hex);
            }
        }
        
        console.log('Final ZOC hexes:', uniqueZocHexes);
        
        return uniqueZocHexes;
    }

} 