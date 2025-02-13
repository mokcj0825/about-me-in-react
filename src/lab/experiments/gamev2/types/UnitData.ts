import { HexCoordinate, createHexCoordinate } from "./HexCoordinate";

export interface UnitData {
  id: string;
  position: HexCoordinate;
  movement: number;
}

export const initialUnits: UnitData[] = [
  { 
    id: '1', 
    position: createHexCoordinate(2, 3),
    movement: 2 
  }
]; 