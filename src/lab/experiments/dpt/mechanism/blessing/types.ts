/**
 * Types for blessing triggers and effects
 */

export type TriggerType = 'on_fatal_damage' | 'after_ultimate' | 'on_turn_start' | 'on_turn_end';
export type EffectType = 'prevent_knockout' | 'consume_resource' | 'heal' | 'restore_energy';
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
  };
}

export interface Blessing {
  id: string;
  name: string;
  path: string;
  target: 'player' | 'enemy';
  type: string;
  trigger: BlessingTrigger;
  effects: BlessingEffect[];
} 