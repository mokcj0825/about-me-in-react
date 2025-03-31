import { TurnState, TurnUnit, TurnEvent } from '../../type/TurnSystem';
import { loadBlessing } from '../blessing/loader';
import { processBlessingEffects } from '../blessing/handler';

export interface ActionResult {
  updatedState: TurnState;
  events: TurnEvent[];
}

export interface DeathCallbackResult {
  wasResurrected: boolean;
  updatedUnit: TurnUnit;
  updatedState: TurnState;
  descriptions?: string[];  // Optional array of descriptions about what happened
}

/**
 * Executes an attack action
 */
export async function executeAttack(
  actor: TurnUnit,
  state: TurnState,
  onDeath?: (unit: TurnUnit, state: TurnState) => Promise<DeathCallbackResult>
): Promise<ActionResult> {
  const events: TurnEvent[] = [];
  let updatedState = { ...state };

  // Find target (for now, randomly select from player units)
  const playerUnits = state.units.filter(u => u.id.startsWith('player_') && u.hp > 0);
  if (playerUnits.length === 0) {
    events.push({ type: 'action', unit: actor, description: 'No valid targets found' });
    return { updatedState, events };
  }

  const target = playerUnits[Math.floor(Math.random() * playerUnits.length)];
  const damage = actor.attack || 0;
  
  events.push({ type: 'action', unit: actor, description: `${actor.name} attacks ${target.name} for ${damage} damage` });

  // Apply damage
  let updatedTarget: TurnUnit = {
    ...target,
    hp: Math.max(0, (target.hp || 0) - damage)
  };

  // If unit died, trigger onDeath callback
  if (updatedTarget.hp === 0) {
    if (onDeath) {
      const result = await onDeath(updatedTarget, updatedState);
      
      if (result.wasResurrected) {
        updatedTarget = result.updatedUnit;
        updatedState = result.updatedState;
        if (result.descriptions) {
          result.descriptions.forEach(desc => events.push({ type: 'effect', unit: updatedTarget, description: desc }));
        }
      } else {
        if (result.descriptions) {
          result.descriptions.forEach(desc => events.push({ type: 'death', unit: updatedTarget, description: desc }));
        }
      }
    }
  }

  // Update state with modified target
  updatedState = {
    ...updatedState,
    units: updatedState.units.map(u => u.id === updatedTarget.id ? updatedTarget : u)
  };

  return { updatedState, events };
}

/**
 * Executes a wait action
 */
export function executeWait(
  actor: TurnUnit,
  state: TurnState
): ActionResult {
  return {
    updatedState: state,
    events: [{ type: 'action', unit: actor, description: `${actor.name} waits` }]
  };
}

/**
 * Executes an ultimate action
 */
export async function executeUltimate(
  actor: TurnUnit,
  state: TurnState
): Promise<ActionResult> {
  const events: TurnEvent[] = [];
  let updatedState = { ...state };

  const energyConsumed = actor.energy || 0;
  let updatedActor: TurnUnit = {
    ...actor,
    energy: 0
  };

  events.push({ type: 'action', unit: actor, description: `${actor.name} uses ultimate, consuming ${energyConsumed} energy` });

  // Process blessings that trigger after ultimate
  if (state.blessings.length > 0) {
    for (const blessingId of state.blessings) {
      try {
        const blessingData = await loadBlessing(blessingId);
        
        if (blessingData.trigger.type === 'after_ultimate' && 
            blessingData.target === 'player' &&
            actor.id.startsWith('player_')) {
          const { updatedUnit, descriptions } = await processBlessingEffects(
            updatedActor,
            blessingData,
            { consumedEnergy: energyConsumed, tempVars: {} }
          );
          
          // Preserve TurnUnit properties
          updatedActor = {
            ...updatedActor,
            hp: updatedUnit.hp,
            maxHp: updatedUnit.maxHp,
            energy: updatedUnit.energy,
            maxEnergy: updatedUnit.maxEnergy
          };
          
          descriptions.forEach((desc: string) => 
            events.push({ type: 'effect', unit: updatedActor, description: desc })
          );
        }
      } catch (error) {
        events.push({ 
          type: 'effect', 
          unit: actor, 
          description: `Error processing blessing: ${error instanceof Error ? error.message : String(error)}` 
        });
      }
    }
  }

  // Update state with modified actor
  updatedState = {
    ...updatedState,
    units: updatedState.units.map(u => u.id === updatedActor.id ? updatedActor : u)
  };

  return { updatedState, events };
} 