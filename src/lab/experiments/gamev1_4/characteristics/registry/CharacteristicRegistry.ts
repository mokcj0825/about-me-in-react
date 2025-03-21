import { CharacteristicProvider } from '../types';
import { UnitData } from '../../types/UnitData';
import { DayWalkerCharacteristic } from '../DayWalkerCharacteristic';
import { NightPhobicCharacteristic } from '../NightPhobicCharacteristic';

class CharacteristicRegistry {
  private providers: Map<string, CharacteristicProvider> = new Map();

  constructor() {
    // Register characteristics
    this.register(new DayWalkerCharacteristic());
    this.register(new NightPhobicCharacteristic());
  }

  register(provider: CharacteristicProvider) {
    this.providers.set(provider.id, provider);
  }

  getEffect(characteristicId: string) {
    return this.providers.get(characteristicId)?.getEffect();
  }

  onDayStart(unit: UnitData) {
    console.log('Checking characteristics for unit:', unit);
    unit.characteristics?.forEach(characteristicId => {
      const effect = this.getEffect(characteristicId);
      if (effect?.onDayStart) {
        effect.onDayStart(unit);
      }
    });
  }

  onNightStart(unit: UnitData) {
    unit.characteristics?.forEach(characteristicId => {
      const effect = this.getEffect(characteristicId);
      if (effect?.onNightStart) {
        effect.onNightStart(unit);
      }
    });
  }
}

export const characteristicRegistry = new CharacteristicRegistry(); 