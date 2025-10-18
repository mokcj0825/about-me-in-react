import { CharacteristicId, Buff } from "./Characteristics";
import { createHexCoordinate } from "../../game-versioning/types/HexCoordinate";
import { VersioningUnitData } from "../../game-versioning/types/UnitData";


export interface UnitData extends VersioningUnitData {
  characteristics: CharacteristicId[];
  buffs: Buff[];
}

export const initialUnits: UnitData[] = [
  { 
    id: '1', 
    position: createHexCoordinate(4, 5),
    movement: 5,
    fraction: 'player',
    characteristics: [],
    buffs: []
  },
  {
    id: '2',
    position: createHexCoordinate(4, 4),
    movement: 5,
    fraction: 'enemy',
    characteristics: [],
    buffs: []
  }, 
  {
    id: '3',
    position: createHexCoordinate(3, 5),
    movement: 5,
    fraction: 'enemy',
    characteristics: [],
    buffs: []
  },
  { 
    id: '4', 
    position: createHexCoordinate(3, 3),
    movement: 5,
    fraction: 'ally',
    characteristics: ['00001'],
    buffs: []
  },
  { 
    id: '5', 
    position: createHexCoordinate(4, 6),
    movement: 5,
    fraction: 'player',
    characteristics: [],
    buffs: []
  }, 
  { 
    id: '5', 
    position: createHexCoordinate(2, 6),
    movement: 5,
    fraction: 'enemy',
    characteristics: [],
    buffs: []
  }
]; 