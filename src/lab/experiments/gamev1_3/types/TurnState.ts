import { TurnPhase } from "../systems/TurnSystem";

export type DayNightCycle = 'day' | 'night';

export interface TurnState {
  number: number;
  cycle: DayNightCycle;
  phase: TurnPhase;
} 