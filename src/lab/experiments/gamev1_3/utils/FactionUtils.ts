import { UnitData } from '../types/UnitData';

export function isHostileUnit(unit: UnitData, target: UnitData): boolean {
    if (unit.fraction === target.fraction) return false;
    
    if (unit.fraction === 'player' || unit.fraction === 'ally') {
        return target.fraction === 'enemy';
    }
    
    return target.fraction === 'player' || target.fraction === 'ally';
}

export function isFriendlyUnit(unit: UnitData, target: UnitData): boolean {
    return !isHostileUnit(unit, target);
} 