import { Unit } from '../../type/InstructionData';
import { Blessing, BlessingEffect, EffectType, ResourceType, ValueBase } from './types';

interface EffectContext {
  unit: Unit;
  effect: BlessingEffect;
  battleContext: {
    consumedEnergy?: number;
    incomingDamage?: number;
    sourceId?: string;
  };
}

interface EffectResult {
  updatedUnit: Unit;
  description: string;
}

/**
 * Calculates value based on different bases and context
 */
function calculateValue(base: ValueBase, unit: Unit, context: EffectContext['battleContext'], multiplier: number): number {
  switch (base) {
    case 'current_hp':
      return Math.floor((unit.hp || 0) * multiplier);
    case 'max_hp':
      return Math.floor((unit.maxHp || 0) * multiplier);
    case 'current_energy':
      return Math.floor((unit.energy || 0) * multiplier);
    case 'max_energy':
      return Math.floor((unit.maxEnergy || 0) * multiplier);
    case 'consumed_energy':
      return Math.floor((context.consumedEnergy || 0) * multiplier);
    default:
      return 0;
  }
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
    case 'hp': return { ...unit, hp: Math.min(value, unit.maxHp || 0) };
    case 'energy': return { ...unit, energy: Math.min(value, unit.maxEnergy || 0) };
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
      description: `Consumed ${amountToConsume} ${effect.resource}`,
      consumedAmount: amountToConsume
    };
  },

  resurrect: ({ unit, effect }) => {
    console.log('resurrect', unit, effect);
    // Only resurrect if unit is actually dead (hp = 0)
    if (unit.hp !== 0) {
      return { updatedUnit: unit, description: 'Unit is not dead, cannot resurrect' };
    }

    // Resurrect with specified HP amount or percentage
    let resurrectionHp = 1; // Default to 1 if no amount specified
    if (effect.amount) {
      resurrectionHp = effect.measurement === 'percentage'
        ? Math.floor((unit.maxHp || 1) * effect.amount / 100)
        : effect.amount;
    }

    const updatedUnit = { ...unit, hp: Math.min(resurrectionHp, unit.maxHp || 1) };
    console.log('updatedUnit', updatedUnit);
    return {
      updatedUnit,
      description: `Unit resurrected with ${resurrectionHp} HP`
    };
  },

  heal: ({ unit, effect, battleContext }) => {
    if (!effect.value) {
      return { updatedUnit: unit, description: 'Invalid heal effect' };
    }

    // For consumed_energy base, use the actual consumed amount from battleContext
    const healAmount = effect.value.base === 'consumed_energy' && battleContext.consumedEnergy
      ? Math.floor(battleContext.consumedEnergy * effect.value.multiplier)
      : calculateValue(effect.value.base, unit, battleContext, effect.value.multiplier);

    const currentHp = unit.hp || 0;
    const maxHp = unit.maxHp || 0;
    const updatedUnit = setResourceValue(unit, 'hp', Math.min(currentHp + healAmount, maxHp));

    return {
      updatedUnit,
      description: `Healed for ${healAmount} HP`
    };
  },

  restore_energy: ({ unit, effect, battleContext }) => {
    if (!effect.value) {
      return { updatedUnit: unit, description: 'Invalid restore_energy effect' };
    }

    const restoreAmount = calculateValue(effect.value.base, unit, battleContext, effect.value.multiplier);
    const currentEnergy = unit.energy || 0;
    const updatedUnit = setResourceValue(unit, 'energy', currentEnergy + restoreAmount);

    return {
      updatedUnit,
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
  battleContext: EffectContext['battleContext'] = {}
): Promise<{ updatedUnit: Unit; descriptions: string[] }> {
  let currentUnit = { ...unit };
  const descriptions: string[] = [];
  let currentContext = { ...battleContext };

  // Process effects in sequence, updating battleContext as needed
  for (const effect of blessing.effects) {
    if (!effect.type || !(effect.type in effectHandlers)) {
      descriptions.push(`Invalid effect: ${effect.type || 'missing type'}`);
      continue;
    }

    const handler = effectHandlers[effect.type];
    const result = handler({
      unit: currentUnit,
      effect,
      battleContext: currentContext
    });

    currentUnit = result.updatedUnit;
    descriptions.push(result.description);

    // Update context with consumed amount if available
    if (effect.type === 'consume_resource' && 'consumedAmount' in result) {
      currentContext = {
        ...currentContext,
        consumedEnergy: (result as { consumedAmount: number }).consumedAmount
      };
    }
  }

  return { updatedUnit: currentUnit, descriptions };
} 