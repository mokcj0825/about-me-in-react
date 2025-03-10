import { UnitData } from '../types/UnitData';
import { HexCoordinate } from '../types/HexCoordinate';
import { buffRegistry } from '../buffs/registry/BuffRegistry';

export class UnitActionHandler {
    handleUnitMove(unit: UnitData, newPosition: HexCoordinate): UnitData {
        const updatedUnit = {
            ...unit,
            position: newPosition,
            hasMoved: true
        };
        
        buffRegistry.calculateStats(updatedUnit);
        return updatedUnit;
    }

    // ... other methods ...
} 