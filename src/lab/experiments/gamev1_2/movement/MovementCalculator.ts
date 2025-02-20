import { HexCoordinate, createHexCoordinate, getNeighbors } from "../types/HexCoordinate";
import { UnitData, MovementType } from "../types/UnitData";
import { MovementRule } from "./types";
import { ZoneOfControl } from "../zoc/types";
import { isHostileUnit } from "../utils/FactionUtils";
import { hasCharacteristic } from "../types/Characteristics";

export interface MovementCost {
    [key: string]: {
        foot: number;
        ooze: number;
        float: number;
        flying: number;
    };
}

export const DEFAULT_MOVEMENT_COSTS: MovementCost = {
    'plain': { foot: 1, ooze: 1, float: 1, flying: 1 },
    'road': { foot: 1, ooze: 2, float: 1, flying: 1 },
    'forest': { foot: 2, ooze: 2, float: 1, flying: 1 },
    'cliff': { foot: 3, ooze: 999, float: 2, flying: 1 },
    'mountain': { foot: 3, ooze: 999, float: 2, flying: 1 },
    'wasteland': { foot: 2, ooze: 1, float: 1, flying: 1 },
    'ruins': { foot: 2, ooze: 2, float: 1, flying: 1 },
    'river': { foot: 999, ooze: 1, float: 1, flying: 1 },
    'swamp': { foot: 2, ooze: 1, float: 1, flying: 1 },
    'sea': { foot: 999, ooze: 2, float: 1, flying: 1 },
};

export class MovementCalculator {
    constructor(
        private movementRule: MovementRule,
        private zocRules: ZoneOfControl[]
    ) {}

    getMovementCost(terrainType: string, movementType: MovementType, unit?: UnitData): number {
        const costs = DEFAULT_MOVEMENT_COSTS[terrainType] || DEFAULT_MOVEMENT_COSTS['plain'];
        let cost = costs[movementType];

        // Apply amphibious characteristic if unit has it
        if (unit && hasCharacteristic(unit.characteristics, unit.buffs, 'amphibious')) {
            switch (terrainType) {
                case 'river':
                case 'swamp':
                    cost = Math.min(cost, 1);
                    break;
                case 'sea':
                    cost = Math.min(cost, 2);
                    break;
            }
        }

        return cost;
    }

    getMoveableGrids(startCoord: HexCoordinate, movement: number, units: UnitData[]): HexCoordinate[] {
        const result = new Set<string>();
        const visited = new Map<string, number>();
        
        const movingUnit = units.find(u => 
            u.position.x === startCoord.x && u.position.y === startCoord.y
        );
        if (!movingUnit) return [];

        const isAffectedByZOC = this.zocRules.some(rule => rule.affectsUnit(movingUnit));
        const opposingZOC = isAffectedByZOC ? this.getOpposingZOC(movingUnit, units) : [];
        
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

    private getOpposingZOC(movingUnit: UnitData, units: UnitData[]): HexCoordinate[] {
        const hostileUnits = units.filter(u => isHostileUnit(movingUnit, u));
        return hostileUnits.flatMap(u => 
            this.zocRules.flatMap(rule => rule.getControlledArea(u.position))
        );
    }

    private calculateRemainingMove(
        current: HexCoordinate,
        neighbor: HexCoordinate,
        remainingMove: number,
        isAffectedByZOC: boolean,
        opposingZOC: HexCoordinate[],
        movingUnit: UnitData
    ): number {
        const terrainType = this.movementRule.getTerrainType(neighbor);
        const moveCost = this.getMovementCost(terrainType, movingUnit.movementType, movingUnit);
        let newRemainingMove = remainingMove - moveCost;

        if (isAffectedByZOC) {
            const currentInZOC = opposingZOC.some(zoc => 
                zoc.x === current.x && zoc.y === current.y
            );
            const neighborInZOC = opposingZOC.some(zoc => 
                zoc.x === neighbor.x && zoc.y === neighbor.y
            );
            
            if (currentInZOC && neighborInZOC) {
                newRemainingMove = 0;
            }
        }

        return newRemainingMove;
    }
} 