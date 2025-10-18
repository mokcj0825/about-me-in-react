import { HexCoordinate } from "../../game-versioning/types/HexCoordinate";

export interface UnitSelectedEvent {
  unitId: string;
  position: HexCoordinate;
}

export interface UnitHoveredEvent {
  unitId: string;
} 