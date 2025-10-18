import { HexCoordinate } from "../../game-versioning/types/HexCoordinate";
import { UnitData } from "../types/UnitData";

export interface ZoneOfControl {
    getControlledArea: (position: HexCoordinate) => HexCoordinate[];
    affectsUnit: (unit: UnitData) => boolean;
} 