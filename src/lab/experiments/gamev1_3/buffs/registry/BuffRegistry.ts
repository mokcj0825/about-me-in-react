import { BuffProvider, BuffEffect } from '../types';
import { Buff, UnitData } from '../../types/UnitData';
import { characteristicRegistry } from '../../characteristics/registry/CharacteristicRegistry';

class BuffRegistry {
  private providers: Map<string, BuffProvider> = new Map();

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

    // Apply characteristic modifiers first
    unit.characteristics.forEach((charId: string) => {
      const effect = characteristicRegistry.getEffect(charId);
      if (effect) {
        if (effect.modifyMovement) movement = effect.modifyMovement(unit, movement);
        if (effect.modifyAttack) attack = effect.modifyAttack(unit, attack);
        if (effect.modifyDefense) defense = effect.modifyDefense(unit, defense);
      }
    });

    // Then apply buff modifiers
    unit.buffs?.forEach((buff: Buff) => {
      const effect = this.getEffect(buff.id);
      if (effect) {
        if (effect.modifyMovement) movement = effect.modifyMovement(unit, movement);
        if (effect.modifyAttack) attack = effect.modifyAttack(unit, attack);
        if (effect.modifyDefense) defense = effect.modifyDefense(unit, defense);
      }
    });

    // Update unit stats
    unit.movement = movement;
    unit.attack = attack;
    unit.defense = defense;
  }

  // Handle turn end for buffs
  processTurnEnd(unit: UnitData): void {
    const remainingBuffs: Buff[] = [];

    unit.buffs?.forEach((buff: Buff) => {
      const effect = this.getEffect(buff.id);
      if (effect) {
        if (effect.duration > 0) {
          buff.duration--;
          if (buff.duration > 0) {
            remainingBuffs.push(buff);
          } else if (effect.onRemove) {
            effect.onRemove(unit);
          }
        } else if (effect.duration === -1) {
          // Permanent buff
          remainingBuffs.push(buff);
        }

        if (effect.onTurnEnd) {
          effect.onTurnEnd(unit);
        }
      }
    });

    unit.buffs = remainingBuffs;
    this.calculateStats(unit);
  }

  applyEffects(event: string, unit: UnitData): void {
    unit.buffs?.forEach((buff: Buff) => {
      const effect = this.getEffect(buff.id);
      if (effect && effect[event as keyof BuffEffect]) {
        (effect[event as keyof BuffEffect] as Function)(unit);
      }
    });
    this.calculateStats(unit);
  }
}

export const buffRegistry = new BuffRegistry(); 