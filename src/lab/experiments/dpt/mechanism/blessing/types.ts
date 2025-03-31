/**
 * Types for blessing triggers and effects
 */

export type TriggerType = 'on_fatal_damage' | 'after_ultimate' | 'on_turn_start' | 'on_turn_end' | 'on_knockout';
export type EffectType = 'consume_resource' | 'heal' | 'restore_energy' | 'resurrect';
export type ResourceType = 'hp' | 'energy';
export type ValueBase = 'current_hp' | 'max_hp' | 'current_energy' | 'max_energy' | 'consumed_energy';
export type Measurement = 'percentage' | 'absolute';

export interface BlessingTrigger {
  type: TriggerType;
  conditions: string[];
  usage: 'once_per_battle' | 'once_per_battle_team' | 'always';
}

export interface BlessingEffect {
  type: EffectType;
  resource?: ResourceType;
  amount?: number;
  measurement?: Measurement;
  duration?: string;
  value?: {
    base: ValueBase;
    multiplier: number;
    measurement?: Measurement;
  };
  // For storing/reading temporary values
  stores?: string[];  // Variables this effect will write to
  reads?: string[];   // Variables this effect will read from
}

export interface Blessing {
  id: string;
  name: string;
  path: string;
  target: 'player' | 'enemy';
  type: string;
  trigger: BlessingTrigger;
  effects: BlessingEffect[];
  // Declare all temporary variables used by this blessing
  tempVars: string[];
} 