import { TurnState, TurnUnit, TurnEvent, TurnResult } from '../../type/TurnSystem';
import { loadBlessing } from '../blessing/loader';
import { processBlessingEffects } from '../blessing/handler';
import { handleAttack } from './manager_handler/attack';
import { handleUltimate } from './manager_handler/ultimate';

/**
 * Manages the turn-based battle system
 * 
 * Note on Action Handler Imports:
 * Action handlers (attack, ultimate) are imported statically rather than dynamically because:
 * 1. They are core battle mechanics that are always required
 * 2. They are small, essential modules used frequently during battle
 * 3. They need to be immediately available for battle execution
 * 4. They are tightly coupled with the turn manager's functionality
 * 
 * While we generally prefer dynamic imports for scalability, in this case static imports
 * provide better reliability and simpler error handling without sacrificing maintainability.
 */
export class TurnManager {
  private state: TurnState;
  private actionQueue: { actor: TurnUnit; action: string }[] = [];
  private usedBlessings: Set<string> = new Set();

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
   * Finds the unit with the lowest action value that can act
   */
  private findNextActiveUnit(): TurnUnit | null {
    // Find unit with lowest action value that can act
    const nextUnit = this.state.units
      .filter(unit => unit.canAct && unit.hp > 0)
      .sort((a, b) => a.actionValue - b.actionValue)[0];

    if (!nextUnit) return null;

    return nextUnit;
  }

  /**
   * Processes the next turn in the battle
   */
  public async processTurn(): Promise<{ newState: TurnState; events: TurnEvent[] }> {
    const events: TurnEvent[] = [];
    let updatedState = { ...this.state };
    
    if (updatedState.isPaused) {
      return { newState: updatedState, events };
    }

    // Find unit with lowest action value
    const nextUnit = this.findNextActiveUnit();
    if (!nextUnit) {
      return { newState: updatedState, events };
    }

    // Update action values for all units
    const minActionValue = nextUnit.actionValue;
    updatedState = {
      ...updatedState,
      units: updatedState.units.map(unit => ({
        ...unit,
        actionValue: unit.id === nextUnit.id 
          ? unit.baseActionValue  // Reset active unit's action value
          : unit.actionValue - minActionValue  // Subtract minimum action value from others
      }))
    };

    // Process start of turn effects
    const { unit: unitAfterStart, events: startEvents } = this.processStartTurnEffects(nextUnit);
    events.push(...startEvents);

    // Set as active unit
    updatedState = {
      ...updatedState,
      activeUnit: unitAfterStart,
      turnCount: updatedState.turnCount + 1
    };

    events.push({
      type: 'turn_start',
      unit: unitAfterStart,
      description: `${unitAfterStart.name}'s turn begins`
    });

    // If unit died from DoT, skip their turn
    if (unitAfterStart.hp === 0) {
      updatedState = {
        ...updatedState,
        activeUnit: null
      };
      this.setState(updatedState);
      return { newState: updatedState, events };
    }

    // Process queued actions
    const queuedAction = this.actionQueue.find(a => a.actor.id === unitAfterStart.id);
    if (queuedAction) {
      const { action } = queuedAction;
      
      switch (true) {
        case action.startsWith('attack:'): {
          const targetId = action.split(':')[1];
          const { updatedState: newState, events: attackEvents } = await handleAttack({
            actor: unitAfterStart,
            targetId,
            state: updatedState,
            usedBlessings: this.usedBlessings
          });
          
          updatedState = newState;
          events.push(...attackEvents);
          break;
        }
        
        case action === 'ultimate': {
          const { updatedState: newState, events: ultimateEvents } = await handleUltimate({
            actor: unitAfterStart,
            state: updatedState,
            usedBlessings: this.usedBlessings
          });
          
          updatedState = newState;
          events.push(...ultimateEvents);
          break;
        }
        
        default:
          break;
      }
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
    updatedState = {
      ...updatedState,
      units: updatedState.units.map(u => u.id === finalUnit.id ? finalUnit : u),
      activeUnit: null
    };

    // Clear the processed action and queue new actions for all units
    this.actionQueue = this.actionQueue.filter(a => a.actor.id !== unitAfterStart.id);
    updatedState.units.forEach(unit => {
      if (unit.canAct && unit.hp > 0) {
        let actionType = 'wait';
        
        if (unit.strategy) {
          // Check for ultimate first if energy threshold is met
          const ultimateAction = unit.strategy.actions.find(a => a.type === 'ultimate');
          if (ultimateAction && (!ultimateAction.energy_threshold || (unit.energy || 0) >= ultimateAction.energy_threshold)) {
            actionType = 'ultimate';
          }
          // Then check for attack if no ultimate
          else if (unit.strategy.type === 'aggressive') {
            const attackAction = unit.strategy.actions.find(a => a.type === 'attack');
            if (attackAction) {
              actionType = `attack:${attackAction.target}`;
            }
          }
        }
        
        this.actionQueue.push({ actor: unit, action: actionType });
      }
    });

    // Update the manager's state
    this.setState(updatedState);

    return { newState: updatedState, events };
  }

  /**
   * Processes start of turn effects
   */
  private processStartTurnEffects(unit: TurnUnit): { unit: TurnUnit; events: TurnEvent[] } {
    const events: TurnEvent[] = [];
    let updatedUnit = { ...unit };

    // Process DoT effects
    if (updatedUnit.statusEffects?.some(effect => effect.type === 'dot')) {
      const dotDamage = 50; // Default DoT damage
      updatedUnit.hp = Math.max(0, updatedUnit.hp - dotDamage);
      events.push({
        type: 'effect',
        unit: updatedUnit,
        description: `${updatedUnit.name} takes ${dotDamage} damage from DoT`
      });
    }

    return { unit: updatedUnit, events };
  }

  /**
   * Processes end of turn effects
   */
  private processEndTurnEffects(unit: TurnUnit): { unit: TurnUnit; events: TurnEvent[] } {
    const events: TurnEvent[] = [];
    let updatedUnit = { ...unit };

    // Process energy regeneration
    if (updatedUnit.energy < (updatedUnit.maxEnergy || 100)) {
      const energyRegen = 20; // Default energy regeneration
      updatedUnit.energy = Math.min(updatedUnit.maxEnergy || 100, updatedUnit.energy + energyRegen);
      events.push({
        type: 'effect',
        unit: updatedUnit,
        description: `${updatedUnit.name} regenerates ${energyRegen} energy`
      });
    }

    return { unit: updatedUnit, events };
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