import { UnitData } from "../types/UnitData";

export const isHostileUnit = (movingUnit: UnitData, targetUnit: UnitData): boolean => {
    if (movingUnit.fraction === 'enemy') {
        return targetUnit.fraction === 'player' || targetUnit.fraction === 'ally';
    }
    if (movingUnit.fraction === 'player' || movingUnit.fraction === 'ally') {
        return targetUnit.fraction === 'enemy';
    }
    return false;
}; 