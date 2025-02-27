import type { TerrainType } from '../movement/types';
import { UnitData } from './UnitData';

export type UIModalState = {
  type: 'terrain' | 'unitSelection' | null;
  data?: {
    terrain?: TerrainType;
    units?: UnitData[];
    position?: { x: number; y: number };
  };
}; 