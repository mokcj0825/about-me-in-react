import { UnitData } from "../types/UnitData";

export const isHostileUnit = (movingUnit: UnitData, targetUnit: UnitData): boolean => {
    if (movingUnit.faction === 'enemy') {
        return targetUnit.faction === 'player' || targetUnit.faction === 'ally';
    }
    if (movingUnit.faction === 'player' || movingUnit.faction === 'ally') {
        return targetUnit.faction === 'enemy';
    }
    return false;
}; 