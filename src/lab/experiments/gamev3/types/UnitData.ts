import { HexCoordinate, createHexCoordinate } from "./HexCoordinate";

export type Faction = 'player' | 'ally' | 'enemy';

export interface UnitData {
  id: string;
  position: HexCoordinate;
  movement: number;
  faction: Faction;
}

export const initialUnits: UnitData[] = [
  { 
    id: '1', 
    position: createHexCoordinate(2, 3),
    movement: 5,
    faction: 'player'
  },
  {
    id: '2',
    position: createHexCoordinate(4, 4),
    movement: 5,
    faction: 'enemy'
  }
]; 