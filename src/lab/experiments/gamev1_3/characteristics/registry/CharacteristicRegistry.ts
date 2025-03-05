import { CharacteristicProvider, CharacteristicEffect } from '../types';
import { UnitData } from '../../types/UnitData';

class CharacteristicRegistry {
  private providers: Map<string, CharacteristicProvider> = new Map();

  register(provider: CharacteristicProvider) {
    this.providers.set(provider.id, provider);
  }

  getEffect(characteristicId: string): CharacteristicEffect | undefined {
    return this.providers.get(characteristicId)?.getEffect();
  }

  applyEffects(eventName: keyof CharacteristicEffect, unit: UnitData, ...args: any[]) {
    unit.characteristics.forEach((charId: string) => {
      const effect = this.getEffect(charId);
      if (effect && effect[eventName]) {
        (effect[eventName] as Function)(unit, ...args);
      }
    });
  }
}

export const characteristicRegistry = new CharacteristicRegistry(); 