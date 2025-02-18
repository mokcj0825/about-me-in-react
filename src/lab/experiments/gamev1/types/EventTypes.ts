import { HexCoordinate } from "./HexCoordinate";

export interface UnitSelectedEvent {
  unitId: string;
  position: HexCoordinate;
}

export interface UnitHoveredEvent {
  unitId: string;
} 