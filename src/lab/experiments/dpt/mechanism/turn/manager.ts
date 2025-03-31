import { TurnState, TurnUnit, TurnEvent, TurnResult } from '../../type/TurnSystem';

/**
 * Manages the turn-based battle system
 */
export class TurnManager {
  private state: TurnState;
  private actionQueue: { actor: TurnUnit; action: string }[] = [];

  constructor(initialState: TurnState) {
    this.state = initialState;
  }

  /**
   * Gets the current battle state
   */
  public getState(): TurnState {
    return this.state;
  }

  /**
   * Updates the current battle state
   */
  public setState(newState: TurnState): void {
    this.state = newState;
  }

  /**
   * Queues an action for a specific unit
   */
  public queueAction(actor: TurnUnit, actionType: string): void {
    this.actionQueue.push({ actor, action: actionType });
  }

  /**
   * Processes the next turn in the battle
   */
  public processTurn(): TurnResult {
    const events: TurnEvent[] = [];
    
    if (this.state.isPaused) {
      return { newState: this.state, events };
    }

    // Find unit with lowest action value
    const nextUnit = this.findNextActiveUnit();
    if (!nextUnit) {
      return { newState: this.state, events };
    }

    // Subtract time until next turn from all units
    const updatedUnits = this.state.units.map(unit => ({
      ...unit,
      actionValue: unit.actionValue - nextUnit.actionValue
    }));

    // Process start of turn effects
    const { unit: unitAfterStart, events: startEvents } = this.processStartTurnEffects(nextUnit);
    events.push(...startEvents);

    // Set as active unit
    this.state = {
      ...this.state,
      units: updatedUnits.map(u => u.id === unitAfterStart.id ? unitAfterStart : u),
      activeUnit: unitAfterStart,
      turnCount: this.state.turnCount + 1
    };

    events.push({
      type: 'turn_start',
      unit: unitAfterStart,
      description: `${unitAfterStart.name}'s turn begins`
    });

    // If unit died from DoT, skip their turn
    if (unitAfterStart.hp === 0) {
      this.state = {
        ...this.state,
        activeUnit: null
      };
      return { newState: this.state, events };
    }

    // Reset action value for next turn
    const unitAfterAction = {
      ...unitAfterStart,
      actionValue: unitAfterStart.baseActionValue
    };

    // Process end of turn effects
    const { unit: finalUnit, events: endEvents } = this.processEndTurnEffects(unitAfterAction);
    events.push(...endEvents);

    events.push({
      type: 'turn_end',
      unit: finalUnit,
      description: `${finalUnit.name}'s turn ends`
    });

    // Update final state
    this.state = {
      ...this.state,
      units: this.state.units.map(u => u.id === finalUnit.id ? finalUnit : u),
      activeUnit: null
    };

    return { newState: this.state, events };
  }

  /**
   * Finds the unit with the lowest action value
   */
  private findNextActiveUnit(): TurnUnit | null {
    return this.state.units
      .filter(unit => unit.hp > 0)
      .reduce((lowest, current) => {
        if (!lowest || current.actionValue < lowest.actionValue) {
          return current;
        }
        return lowest;
      }, null as TurnUnit | null);
  }

  /**
   * Process start of turn effects (DoTs, etc.)
   */
  private processStartTurnEffects(unit: TurnUnit): { unit: TurnUnit; events: TurnEvent[] } {
    const events: TurnEvent[] = [];
    let totalDamage = 0;

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

    if (totalDamage > 0) {
      const updatedUnit = {
        ...unit,
        hp: Math.max(0, unit.hp - totalDamage)
      };

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
   * Process end of turn effects
   */
  private processEndTurnEffects(unit: TurnUnit): { unit: TurnUnit; events: TurnEvent[] } {
    const events: TurnEvent[] = [];
    const updatedEffects = unit.statusEffects.map(effect => ({
      ...effect,
      hasTickedThisTurn: false,
      duration: effect.duration > 0 ? effect.duration - 1 : effect.duration
    })).filter(effect => effect.duration !== 0);

    const removedEffects = unit.statusEffects.filter(effect => 
      effect.duration > 0 && effect.duration - 1 === 0
    );

    removedEffects.forEach(effect => {
      events.push({
        type: 'status_tick',
        unit,
        data: { effect },
        description: `${effect.description} has worn off from ${unit.name}`
      });
    });

    return {
      unit: { ...unit, statusEffects: updatedEffects },
      events
    };
  }

  /**
   * Pauses the turn system
   */
  public pause(): void {
    this.state = { ...this.state, isPaused: true };
  }

  /**
   * Resumes the turn system
   */
  public resume(): void {
    this.state = { ...this.state, isPaused: false };
  }
} 