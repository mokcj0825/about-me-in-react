import { Unit } from '../../type/InstructionData';
import { Blessing, BlessingEffect, EffectType, ResourceType } from './types';

interface EffectContext {
  unit: Unit;
  effect: BlessingEffect;
  consumedEnergy?: number;
}

interface EffectResult {
  updatedUnit: Unit;
  description: string;
}

/**
 * Type-safe resource accessor
 */
function getResourceValue(unit: Unit, resource: ResourceType): number {
  switch (resource) {
    case 'hp': return unit.hp || 0;
    case 'energy': return unit.energy || 0;
    default: {
      const _exhaustiveCheck: never = resource;
      return _exhaustiveCheck;
    }
  }
}

/**
 * Type-safe resource setter
 */
function setResourceValue(unit: Unit, resource: ResourceType, value: number): Unit {
  switch (resource) {
    case 'hp': return { ...unit, hp: value };
    case 'energy': return { ...unit, energy: value };
    default: {
      const _exhaustiveCheck: never = resource;
      return _exhaustiveCheck;
    }
  }
}

/**
 * Registry of effect handlers for different effect types
 */
const effectHandlers: Record<EffectType, (context: EffectContext) => EffectResult> = {
  prevent_knockout: ({ unit }) => ({
    updatedUnit: unit,
    description: 'Prevented knockout'
  }),

  consume_resource: ({ unit, effect }) => {
    if (!effect.resource || !effect.amount) {
      return { updatedUnit: unit, description: 'Invalid consume_resource effect' };
    }

    const currentValue = getResourceValue(unit, effect.resource);
    const amountToConsume = effect.measurement === 'percentage'
      ? Math.floor((currentValue * effect.amount) / 100)
      : effect.amount;

    const updatedUnit = setResourceValue(
      unit,
      effect.resource,
      Math.max(0, currentValue - amountToConsume)
    );

    return {
      updatedUnit,
      description: `Consumed ${amountToConsume} ${effect.resource}`
    };
  },

  heal: ({ unit, effect, consumedEnergy }) => {
    if (!effect.value) {
      return { updatedUnit: unit, description: 'Invalid heal effect' };
    }

    let healAmount = 0;
    switch (effect.value.base) {
      case 'max_hp':
        healAmount = Math.floor((unit.maxHp || 0) * effect.value.multiplier);
        break;
      case 'consumed_energy':
        healAmount = Math.floor((consumedEnergy || 0) * effect.value.multiplier);
        break;
      // Add more cases for other base types
    }

    const newHp = Math.min((unit.hp || 0) + healAmount, unit.maxHp || 0);
    return {
      updatedUnit: { ...unit, hp: newHp },
      description: `Healed for ${healAmount} HP`
    };
  },

  restore_energy: ({ unit, effect }) => {
    if (!effect.value) {
      return { updatedUnit: unit, description: 'Invalid restore_energy effect' };
    }

    let restoreAmount = 0;
    switch (effect.value.base) {
      case 'max_energy':
        restoreAmount = Math.floor((unit.maxEnergy || 0) * effect.value.multiplier);
        break;
      // Add more cases for other base types
    }

    const newEnergy = Math.min((unit.energy || 0) + restoreAmount, unit.maxEnergy || 0);
    return {
      updatedUnit: { ...unit, energy: newEnergy },
      description: `Restored ${restoreAmount} energy`
    };
  }
};

/**
 * Processes a blessing's effects on a unit
 */
export async function processBlessingEffects(
  unit: Unit,
  blessing: Blessing,
  context: { consumedEnergy?: number } = {}
): Promise<{ updatedUnit: Unit; descriptions: string[] }> {
  let currentUnit = { ...unit };
  const descriptions: string[] = [];

  for (const effect of blessing.effects) {
    const handler = effectHandlers[effect.type];
    if (!handler) {
      descriptions.push(`Unknown effect type: ${effect.type}`);
      continue;
    }

    const result = handler({ unit: currentUnit, effect, ...context });
    currentUnit = result.updatedUnit;
    descriptions.push(result.description);
  }

  return { updatedUnit: currentUnit, descriptions };
} 