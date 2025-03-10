import { UnitData, UnitFaction } from '../types/UnitData';

export function isHostileUnit(unit: UnitData, target: UnitData): boolean {
    if (unit.faction === target.faction) return false;
    
    if (unit.faction === 'player' || unit.faction === 'ally') {
        return target.faction === 'enemy';
    }
    
    return target.faction === 'player' || target.faction === 'ally';
}

export function isFriendlyUnit(unit: UnitData, target: UnitData): boolean {
    return !isHostileUnit(unit, target);
} 