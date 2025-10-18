import { UnitData } from "../types/UnitData";
import { HexCoordinate } from "../../game-versioning/types/HexCoordinate";

export interface ZoneOfControl {
    getControlledArea: (position: HexCoordinate) => HexCoordinate[];
    affectsUnit: (unit: UnitData) => boolean;
} 