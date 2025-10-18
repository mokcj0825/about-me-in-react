import { HexCoordinate } from "./HexCoordinate";

export type UnitFraction = 'player' | 'ally' | 'enemy';

export interface VersioningUnitData {
  id: string;
  position: HexCoordinate;
  fraction: UnitFraction;
  movement: number;
}