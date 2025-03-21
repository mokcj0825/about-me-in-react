import {  BuffEffect } from '../BuffEffect';
import { Buff, UnitData } from '../../types/UnitData';
import { characteristicRegistry } from '../../characteristics/registry/CharacteristicRegistry';
import { CharacteristicEffect } from '../../characteristics/types';
import { DayWalkerBuff } from '../DayWalkerBuff';
import { NightPhobicDebuff } from '../NightPhobicDebuff';
import {BuffProvider} from "../BuffProvider";

class BuffRegistry {
  private providers: Map<string, BuffProvider> = new Map();

  constructor() {
    // Register the DayWalkerBuff
    this.register(new DayWalkerBuff());
    this.register(new NightPhobicDebuff());
  }

  register(provider: BuffProvider) {
    this.providers.set(provider.id, provider);
  }

  getEffect(buffId: string): BuffEffect | undefined {
    return this.providers.get(buffId)?.getEffect();
  }

  // Apply modifiers in order, using base values
  calculateStats(unit: UnitData): void {
    // Start with base values
    let movement = unit.baseMovement;
    let attack = unit.baseAttack;
    let defense = unit.baseDefense;
    let maxHitpoint = unit.baseMaxHitpoint;

    // Apply characteristic modifiers first
    unit.characteristics.forEach((charId: string) => {
      const effect = characteristicRegistry.getEffect(charId);
      if (effect) {
        if (effect.modifyMovement) movement = effect.modifyMovement(unit, movement);
        if (effect.modifyAttack) attack = effect.modifyAttack(unit, attack);
        if (effect.modifyDefense) defense = effect.modifyDefense(unit, defense);
        if (effect.modifyMaxHitpoint) maxHitpoint = effect.modifyMaxHitpoint(unit, maxHitpoint);
      }
    });

    // Then apply buff modifiers
    unit.buffs?.forEach((buff: Buff) => {
      const effect = this.getEffect(buff.id);
      if (effect) {
        if (effect.modifyMovement) movement = effect.modifyMovement(unit, movement);
        if (effect.modifyAttack) attack = effect.modifyAttack(unit, attack);
        if (effect.modifyDefense) defense = effect.modifyDefense(unit, defense);
        if (effect.modifyMaxHitpoint) maxHitpoint = effect.modifyMaxHitpoint(unit, maxHitpoint);
      }
    });

    // Update unit stats
    unit.movement = movement;
    unit.attack = attack;
    unit.defense = defense;
    unit.maxHitpoint = maxHitpoint;

    // Ensure current HP doesn't exceed max HP
    if (unit.currentHitpoint > unit.maxHitpoint) {
      unit.currentHitpoint = unit.maxHitpoint;
    }
  }

  applyEffects(event: string, unit: UnitData): void {
    // First apply characteristic effects
    unit.characteristics?.forEach((charId: string) => {
      const effect = characteristicRegistry.getEffect(charId);
      if (effect && typeof effect[event as keyof CharacteristicEffect] === 'function') {
        // Apply characteristic effect which may add/remove buffs
        const handler = effect[event as keyof CharacteristicEffect] as (unit: UnitData) => void;
        handler(unit);
      }
    });

    // Then apply buff effects on the updated buffs
    unit.buffs?.forEach((buff: Buff) => {
      const effect = this.getEffect(buff.id);
      if (effect && typeof effect[event as keyof BuffEffect] === 'function') {
        const handler = effect[event as keyof BuffEffect] as (unit: UnitData) => void;
        handler(unit);
      }
    });
    
    // Finally, recalculate stats with all effects applied
    this.calculateStats(unit);
  }
}

export const buffRegistry = new BuffRegistry(); 