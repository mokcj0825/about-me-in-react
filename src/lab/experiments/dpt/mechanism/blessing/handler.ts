import { Unit } from '../../type/InstructionData';
import { Blessing, BlessingEffect, EffectType, ResourceType, ValueBase } from './types';

interface EffectContext {
  unit: Unit;
  effect: BlessingEffect;
  battleContext: {
    consumedEnergy?: number;
    incomingDamage?: number;
    sourceId?: string;
    tempVars: Record<string, number>;  // For storing temporary calculation results
  };
}

interface EffectResult {
  updatedUnit: Unit;
  description: string;
}

/**
 * Validates that an effect only uses declared temporary variables
 */
function validateTempVars(effect: BlessingEffect, blessing: Blessing): void {
  const declaredVars = blessing.tempVars || [];
  const usedVars = [
    ...(effect.stores ? Object.keys(effect.stores) : []),
    ...(effect.reads || [])
  ];
  
  const undeclaredVars = usedVars.filter(v => !declaredVars.includes(v));
  if (undeclaredVars.length > 0) {
    throw new Error(`Effect uses undeclared temporary variables: ${undeclaredVars.join(', ')}`);
  }
}

/**
 * Calculates value based on different bases and context
 */
function calculateValue(base: ValueBase, unit: Unit, context: EffectContext['battleContext'], multiplier: number, measurement?: 'percentage'): number {
  let baseValue: number;
  switch (base) {
    case 'current_hp':
      baseValue = unit.hp || 0;
      break;
    case 'max_hp':
      baseValue = unit.maxHp || 0;
      break;
    case 'current_energy':
      baseValue = unit.energy || 0;
      break;
    case 'max_energy':
      baseValue = unit.maxEnergy || 0;
      break;
    case 'consumed_energy':
      // For consumed energy, calculate it as a percentage of max energy
      const consumedEnergy = context.consumedEnergy || 0;
      const maxEnergy = unit.maxEnergy || 1;
      baseValue = measurement === 'percentage' ? (consumedEnergy / maxEnergy) * 100 : consumedEnergy;
      break;
    default:
      baseValue = 0;
  }

  // If it's a percentage calculation, apply the multiplier to the percentage value
  if (measurement === 'percentage') {
    const percentageResult = baseValue * multiplier;
    // For resurrection, we want to return a percentage of maxHP
    return Math.floor((unit.maxHp || 1) * (percentageResult / 100));
  }

  return Math.floor(baseValue * multiplier);
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
  consume_resource: ({ unit, effect, battleContext }) => {
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

    // Store values in declared temporary variables
    if (effect.stores) {
      // Store each value according to its declared type
      Object.entries(effect.stores).forEach(([varName, valueType]) => {
        switch (valueType) {
          case 'consumed_amount':
            battleContext.tempVars[varName] = amountToConsume;
            break;
          case 'consumed_percentage':
            battleContext.tempVars[varName] = amountToConsume / (unit.maxEnergy || 1);
            break;
          // Add more cases as needed for other value types
        }
      });
    }

    return {
      updatedUnit,
      description: `Consumed ${amountToConsume} ${effect.resource}`,
      consumedAmount: amountToConsume
    };
  },

  resurrect: ({ unit, effect, battleContext }) => {
    console.log('resurrect', unit, effect, battleContext);
    // Only resurrect if unit is actually dead (hp = 0)
    if (unit.hp !== 0) {
      return { updatedUnit: unit, description: 'Unit is not dead, cannot resurrect' };
    }

    // Calculate resurrection HP using stored percentage
    let resurrectionHp = 1; // Default to 1 if no value specified
    if (effect.value && effect.reads?.includes('pos2') && battleContext.tempVars.pos2 !== undefined) {
      const percentage = battleContext.tempVars.pos2;
      resurrectionHp = Math.max(1, Math.floor((unit.maxHp || 1) * percentage * effect.value.multiplier));
    }

    const updatedUnit = { ...unit, hp: Math.min(resurrectionHp, unit.maxHp || 1) };
    console.log('updatedUnit', updatedUnit);
    console.log('tempVars in resurrect', battleContext.tempVars);
    return {
      updatedUnit,
      description: `Unit resurrected with ${resurrectionHp} HP (${Math.floor((resurrectionHp / (unit.maxHp || 1)) * 100)}% of max HP)`
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
    console.log('tempVars in heal', battleContext.tempVars);
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
    console.log('tempVars in restore_energy', battleContext.tempVars);
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
  battleContext: EffectContext['battleContext'] = { tempVars: {} }
): Promise<{ updatedUnit: Unit; descriptions: string[] }> {
  let currentUnit = { ...unit };
  const descriptions: string[] = [];
  let currentContext = { 
    ...battleContext,
    tempVars: {}  // Always start with fresh tempVars
  };

  // Process effects in sequence, updating battleContext as needed
  for (const effect of blessing.effects) {
    if (!effect.type || !(effect.type in effectHandlers)) {
      descriptions.push(`Invalid effect: ${effect.type || 'missing type'}`);
      continue;
    }

    // Validate temporary variables before processing
    validateTempVars(effect, blessing);

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

  // Clear all temporary variables at the end
  currentContext.tempVars = {};

  return { updatedUnit: currentUnit, descriptions };
} 