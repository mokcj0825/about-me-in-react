import { TurnState, TurnUnit, TurnEvent, TurnResult } from '../../type/TurnSystem';
import { loadBlessing } from '../blessing/loader';
import { processBlessingEffects } from '../blessing/handler';

/**
 * Manages the turn-based battle system
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
      if (action.startsWith('attack:')) {
        const targetId = action.split(':')[1];
        const target = updatedState.units.find(u => u.id === targetId);
        if (target) {
          const damage = unitAfterStart.attack || 100; // Default damage if not specified
          let updatedTarget = {
            ...target,
            hp: Math.max(0, target.hp - damage)
          };
          
          events.push({
            type: 'action',
            unit: unitAfterStart,
            target: updatedTarget,
            description: `${unitAfterStart.name} attacks ${target.name} for ${damage} damage`
          });

          // Process blessing effects if target is a player unit and hasn't used blessing yet
          if (target.id.startsWith('player_') && updatedState.blessings.length > 0) {
            for (const blessingId of updatedState.blessings) {
              // Skip if this blessing has already been used
              if (this.usedBlessings.has(blessingId)) continue;

              try {
                const blessingData = await loadBlessing(blessingId);
                
                if (blessingData.trigger.type === 'on_knockout' && 
                    blessingData.target === 'player') {
                  const { updatedUnit, descriptions } = await processBlessingEffects(
                    updatedTarget as TurnUnit,
                    blessingData,
                    { incomingDamage: damage, tempVars: {} }
                  );
                  
                  // Update target with blessing effects
                  updatedTarget = updatedUnit as TurnUnit;
                  
                  descriptions.forEach(desc => 
                    events.push({
                      type: 'effect',
                      unit: updatedTarget,
                      description: desc
                    })
                  );

                  // Mark blessing as used
                  this.usedBlessings.add(blessingId);
                  break; // Only process one blessing
                }
              } catch (error) {
                events.push({
                  type: 'effect',
                  unit: target,
                  description: `Error processing blessing: ${error instanceof Error ? error.message : String(error)}`
                });
              }
            }
          } else if (updatedTarget.hp === 0) {
            events.push({
              type: 'death',
              unit: updatedTarget,
              description: `${updatedTarget.name} has been defeated`
            });
          }

          // Update units array with modified target
          updatedState = {
            ...updatedState,
            units: updatedState.units.map(u => u.id === targetId ? updatedTarget : u)
          };
        }
      } else if (action === 'ultimate') {
        const energyCost = 120; // Default energy cost
        const updatedUnit = {
          ...unitAfterStart,
          energy: Math.max(0, unitAfterStart.energy - energyCost)
        };
        
        events.push({
          type: 'action',
          unit: updatedUnit,
          description: `${updatedUnit.name} uses Ultimate, consuming ${energyCost} energy`
        });

        updatedState = {
          ...updatedState,
          units: updatedState.units.map(u => u.id === updatedUnit.id ? updatedUnit : u)
        };
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
        const actionType = unit.strategy?.type === 'aggressive' 
          ? `attack:${unit.strategy.actions.find(a => a.type === 'attack')?.target}`
          : 'wait';
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