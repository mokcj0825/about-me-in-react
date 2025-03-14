import { UnitData } from "../types/UnitData";

export interface BuffEffect {
  id: string;
  duration: number;  // -1 for permanent, > 0 for turns remaining
  modifyMovement?: (unit: UnitData, baseValue: number) => number;
  modifyAttack?: (unit: UnitData, baseValue: number) => number;
  modifyDefense?: (unit: UnitData, baseValue: number) => number;
  onApply?: (unit: UnitData) => void;
  onRemove?: (unit: UnitData) => void;
  onTurnEnd?: (unit: UnitData) => void;
}

export interface BuffProvider {
  id: string;
  getEffect(): BuffEffect;
} 