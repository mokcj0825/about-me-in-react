import { buffRegistry } from './registry/BuffRegistry';
import { DayWalkerBuff } from './DayWalkerBuff';
import { NightPhobicDebuff } from './NightPhobicDebuff';

export function initBuffs() {
  buffRegistry.register(new DayWalkerBuff());
  buffRegistry.register(new NightPhobicDebuff());
  // Add more buffs here as needed
} 