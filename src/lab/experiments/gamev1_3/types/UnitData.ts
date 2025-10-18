import { createHexCoordinate } from "./HexCoordinate";

export interface Buff {
  id: string;
  duration: number;
}

export type DamageType = 'physical' | 'magical' | 'true';
export type UnitRole = 'tank' | 'dps' | 'support' | 'control';
export type UnitClass = 'warrior' | 'mage' | 'rogue' | 'priest' | 'archer' | 'knight';
export type UnitDirection = 'top-left' | 'top-right' | 'right' | 'bottom-right' | 'bottom-left' | 'left';
export type MovementType = 'foot' | 'ooze' | 'float' | 'flying';

export interface UnitData extends VersioningUnitData {
  name: string;
  class: UnitClass;
  description: string;
  
  // Core Combat Stats
  attack: number;
  defense: number;
  hitpoint: number;
  agility: number;
  
  // Critical System
  critRate: number;      // Percentage (0-100)
  critDamage: number;    // Multiplier (e.g., 1.5 = 150%)
  
  // Status Effect System
  breakEffect: number;   // Break gauge damage
  effectHitRate: number; // Percentage (0-100)
  effectResist: number;  // Percentage (0-100)
  debuffResist: number;  // Percentage (0-100)
  
  // Recovery System
  healingBoost: number;  // Multiplier (e.g., 1.2 = 120%)
  
  // Energy System
  energy: number;        // Current energy
  maxEnergy: number;     // Maximum energy capacity
  energyRegen: number;   // Per turn regeneration
  
  // Damage Modification
  damageResist: number;  // Percentage (0-100)
  damageBoost: number;   // Multiplier (e.g., 1.3 = 130%)
  vulnerability: string[]; // Array of damage types
  damageMitigation: number; // Flat reduction
  
  // Combat Role
  power: number;         // Overall power rating
  aggro: number;         // Target priority (0-100)
  damageType: DamageType;
  role: UnitRole;
  
  // Direction System
  direction: UnitDirection;
  
  // Characteristics and Buffs
  characteristics: string[];
  buffs?: Buff[];
  
  // Movement System
  movementType: MovementType;
  
  // New properties
  hasMoved: boolean;
  
  // Base stats
  baseMovement: number;
  baseAttack: number;
  baseDefense: number;
}

// Import demo data and convert positions to HexCoordinate
import demoData from '../data/unit-stage-demo.json';
import { HexCoordinate } from "../../game-versioning/types/HexCoordinate";
import { VersioningUnitData } from "../../game-versioning/types/UnitData";

export const initialUnits: UnitData[] = (demoData.initialUnits as any[]).map(unit => ({
  ...unit,
  position: createHexCoordinate(unit.position.x, unit.position.y),
  hasMoved: false
})) as UnitData[]; 