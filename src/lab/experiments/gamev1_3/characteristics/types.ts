import { UnitData } from "../types/UnitData";
import { HexCoordinate } from "../../game-versioning/types/HexCoordinate";

export interface CharacteristicEffect {
  id: string;
  onSelected?: (unit: UnitData) => void;
  onDayStart?: (unit: UnitData) => void;
  onDayEnd?: (unit: UnitData) => void;
  onNightStart?: (unit: UnitData) => void;
  onNightEnd?: (unit: UnitData) => void;
  onMoved?: (unit: UnitData, from: HexCoordinate, to: HexCoordinate) => void;
  onAttackStart?: (attacker: UnitData, defender: UnitData) => void;
  onAttacked?: (defender: UnitData, attacker: UnitData) => void;
  onStateChange?: (unit: UnitData, newState: string) => void;
  modifyMovement?: (unit: UnitData, currentMovement: number) => number;
  modifyDefense?: (unit: UnitData, currentDefense: number) => number;
  modifyAttack?: (unit: UnitData, currentAttack: number) => number;
}

export interface CharacteristicProvider {
  id: string;
  getEffect(): CharacteristicEffect;
} 