import { TurnState, TurnUnit, TurnEvent, TurnResult, StatusEffect } from '../../type/TurnSystem';

/**
 * Creates initial turn state from an array of units
 */
export function createInitialTurnState(units: TurnUnit[]): TurnState {
  return {
    units,
    activeUnit: null,
    turnCount: 0,
    isPaused: false,
    blessings: []
  };
}

/**
 * Finds the unit with the lowest action value
 */
function findNextActiveUnit(units: TurnUnit[]): TurnUnit | null {
  return units.reduce((lowest, current) => {
    if (!lowest || current.actionValue < lowest.actionValue) {
      return current;
    }
    return lowest;
  }, null as TurnUnit | null);
}

/**
 * Process DoT effects at the start of a unit's turn
 */
function processStartTurnEffects(unit: TurnUnit): { unit: TurnUnit; events: TurnEvent[] } {
  const events: TurnEvent[] = [];
  let totalDamage = 0;

  // Process DoT effects
  unit.statusEffects.forEach(effect => {
    if (effect.ticksAtStart && !effect.hasTickedThisTurn) {
      if (effect.type === 'dot') {
        totalDamage += effect.value;
      }
      effect.hasTickedThisTurn = true;
      events.push({
        type: 'dot_damage',
        unit,
        data: { damage: effect.value },
        description: `${unit.name} takes ${effect.value} damage from ${effect.description}`
      });
    }
  });

  // Apply total damage
  if (totalDamage > 0) {
    const updatedUnit = {
      ...unit,
      hp: Math.max(0, unit.hp - totalDamage)
    };

    // Check for death
    if (updatedUnit.hp === 0) {
      events.push({
        type: 'death',
        unit: updatedUnit,
        description: `${updatedUnit.name} has been defeated`
      });
    }

    return { unit: updatedUnit, events };
  }

  return { unit, events };
}

/**
 * Process end of turn effects and tick down durations
 */
function processEndTurnEffects(unit: TurnUnit): { unit: TurnUnit; events: TurnEvent[] } {
  const events: TurnEvent[] = [];
  const updatedEffects: StatusEffect[] = [];

  unit.statusEffects.forEach(effect => {
    // Reset tick flag for next turn
    effect.hasTickedThisTurn = false;

    // Decrease duration if appropriate
    if (effect.duration > 0) {
      const updatedEffect = {
        ...effect,
        duration: effect.duration - 1
      };

      if (updatedEffect.duration > 0) {
        updatedEffects.push(updatedEffect);
      } else {
        events.push({
          type: 'status_tick',
          unit,
          data: { effect },
          description: `${effect.description} has worn off from ${unit.name}`
        });
      }
    } else {
      // Permanent effects
      updatedEffects.push(effect);
    }
  });

  return {
    unit: { ...unit, statusEffects: updatedEffects },
    events
  };
}

/**
 * Advances the turn system by one step
 */
export function processTurn(state: TurnState): TurnResult {
  if (state.isPaused) {
    return { newState: state, events: [] };
  }

  const events: TurnEvent[] = [];
  let newState = { ...state };

  // Find next active unit
  const nextUnit = findNextActiveUnit(state.units);
  if (!nextUnit) {
    return { newState: state, events: [] };
  }

  // Subtract time until next turn from all units
  const updatedUnits = state.units.map(unit => ({
    ...unit,
    actionValue: unit.actionValue - nextUnit.actionValue
  }));

  // Process start of turn effects
  const { unit: unitAfterStart, events: startEvents } = processStartTurnEffects(nextUnit);
  events.push(...startEvents);

  // Set as active unit
  newState = {
    ...newState,
    units: updatedUnits.map(u => u.id === unitAfterStart.id ? unitAfterStart : u),
    activeUnit: unitAfterStart,
    turnCount: state.turnCount + 1
  };

  events.push({
    type: 'turn_start',
    unit: unitAfterStart,
    description: `${unitAfterStart.name}'s turn begins`
  });

  // If unit died from DoT, skip their turn
  if (unitAfterStart.hp === 0) {
    return { newState, events };
  }

  // Reset action value for next turn
  const unitAfterAction = {
    ...unitAfterStart,
    actionValue: unitAfterStart.baseActionValue
  };

  // Process end of turn effects
  const { unit: finalUnit, events: endEvents } = processEndTurnEffects(unitAfterAction);
  events.push(...endEvents);

  events.push({
    type: 'turn_end',
    unit: finalUnit,
    description: `${finalUnit.name}'s turn ends`
  });

  // Update final state
  newState = {
    ...newState,
    units: newState.units.map(u => u.id === finalUnit.id ? finalUnit : u),
    activeUnit: null
  };

  return { newState, events };
}

/**
 * Pauses the turn system (e.g. for ultimate)
 */
export function pauseTurnSystem(state: TurnState): TurnState {
  return { ...state, isPaused: true };
}

/**
 * Resumes the turn system
 */
export function resumeTurnSystem(state: TurnState): TurnState {
  return { ...state, isPaused: false };
} 