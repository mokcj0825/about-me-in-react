import { HexCoordinate, getNeighbors } from "../../types/HexCoordinate";
import { UnitData } from "../../types/UnitData";
import { ZoneOfControl } from "../types";
import { hasCharacteristic } from "../../types/Characteristics";

export class StandardZOC implements ZoneOfControl {
    getControlledArea(position: HexCoordinate): HexCoordinate[] {
        return getNeighbors(position);
    }

    affectsUnit(unit: UnitData): boolean {
        // Flying units ignore ZOC
        if (unit.movementType === 'flying') return false;
        
        // Other units can ignore ZOC if they have the characteristic
        return !hasCharacteristic(unit.characteristics, unit.buffs || [], 'ignore-zoc');
    }
} 