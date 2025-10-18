import { createHexCoordinate, getNeighbors } from "../types/HexCoordinate";
import { UnitData } from "../types/UnitData";
import { MovementRule } from "./types";
import { ZoneOfControl } from "../zoc/types";
import { isHostileUnit } from "../utils/FactionUtils";
import { HexCoordinate } from "../../game-versioning/types/HexCoordinate";

export class MovementCalculator {
    constructor(
        private movementRule: MovementRule,
        private zocRules: ZoneOfControl[]
    ) {}

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
                            opposingZOC
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
        opposingZOC: HexCoordinate[]
    ): number {
        const moveCost = this.movementRule.calculateMovementCost(current, neighbor);
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