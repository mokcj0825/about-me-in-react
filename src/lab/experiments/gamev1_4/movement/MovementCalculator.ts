import { HexCoordinate, getNeighbors } from "../types/HexCoordinate";
import { UnitData, MovementType } from "../types/UnitData";
import { MovementRule } from "./types";
import { ZoneOfControl } from "../zoc/types";
import { movementCostRegistry } from './registry/MovementCostRegistry';
import { buffRegistry } from '../buffs/registry/BuffRegistry';
import {AirMovement} from "./rules/AirMovement";
import {GroundMovement} from "./rules/GroundMovement";
import {StandardZOC} from "../zoc/rules/StandardZOC";

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

export const getMoveableGrids = (unit: UnitData, units: UnitData[]): HexCoordinate[] => {
    const calculator = getMovementCalculator(unit);
    return calculator.getMoveableGrids(unit.position, unit.movement, units);
};

export const getMovementCalculator = (unit: UnitData) => {
    if (unit.movementType === 'flying') {
        return airMovementCalculator; // Air units ignore ZOC
    } else {
        return groundMovementCalculator;
    }
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
        const moveableGrids: HexCoordinate[] = [{
            x: position.x,
            y: position.y,
            z: position.z
        }];
        
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
                    let newRemainingMovement = remainingMovement - cost;
                    
                    if (newRemainingMovement < 0) continue;
                    
                    const isInEnemyZOC = enemyZOC.some(zoc => 
                        zoc.x === neighbor.x && zoc.y === neighbor.y
                    );
                    
                    if (isInEnemyZOC) {
                        newRemainingMovement = 0;
                    }

                    // Check stacking rules
                    const unitsAtTarget = units.filter(u => 
                        u.position.x === neighbor.x && 
                        u.position.y === neighbor.y &&
                        u.id !== movingUnit.id
                    );

                    const canStop = unitsAtTarget.every(u => 
                        (movingUnit.movementType === 'flying' && u.movementType !== 'flying') || 
                        (movingUnit.movementType !== 'flying' && u.movementType === 'flying')
                    );

                    if (canStop) {
                        moveableGrids.push({
                            x: neighbor.x,
                            y: neighbor.y,
                            z: neighbor.z
                        });
                    }
                    
                    visited.add(neighborKey);
                    
                    if (newRemainingMovement > 0) {
                        queue.push([neighbor, newRemainingMovement]);
                    }
                }
            }
        }

        moveableGrids.push({
            x: position.x,
            y: position.y,
            z: position.z
        });
        //console.log('Moveable grids:', moveableGrids);

        return moveableGrids;
    }

    private getEnemyZOC(unit: UnitData, units: UnitData[]): HexCoordinate[] {
        const enemyUnits = units.filter(u => {
            // Skip flying units
            if (u.movementType === 'flying') return false;
            
            // Determine opposing factions based on unit's faction
            if (unit.faction === 'enemy') {
                return u.faction === 'player' || u.faction === 'ally';
            } else if (unit.faction === 'player' || unit.faction === 'ally') {
                return u.faction === 'enemy';
            }
            return false;
        });
        
        //console.log('Enemy units for ZOC:', enemyUnits);
        
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

        //console.log('ZOC hexes before deduplication:', zocHexes);

        const uniqueKeys = new Set<string>();
        const uniqueZocHexes: HexCoordinate[] = [];
        
        for (const hex of zocHexes) {
            const key = `${hex.x},${hex.y}`;
            if (!uniqueKeys.has(key)) {
                uniqueKeys.add(key);
                uniqueZocHexes.push(hex);
            }
        }
        
        //console.log('Final ZOC hexes:', uniqueZocHexes);
        
        return uniqueZocHexes;
    }

}

const airMovementCalculator = new MovementCalculator(new AirMovement(), []);
const groundMovementCalculator = new MovementCalculator(new GroundMovement(), [new StandardZOC()]);