import { Unit } from './InstructionData';

export interface ScriptContext {
  playerUnits: Unit[];
  enemyUnits: Unit[];
  blessings: string[];
  currentLine: number;
} 