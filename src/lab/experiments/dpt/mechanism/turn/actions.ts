import { TurnState, TurnUnit, TurnEvent } from '../../type/TurnSystem';

export interface ActionResult {
  updatedState: TurnState;
  events: TurnEvent[];
}

export interface DeathCallbackResult {
  wasResurrected: boolean;
  updatedUnit: TurnUnit;
  updatedState: TurnState;
}

/**
 * Executes an attack action
 */
export async function executeAttack(
  actor: TurnUnit,
  state: TurnState,
  onDeath?: (unit: TurnUnit, state: TurnState) => Promise<DeathCallbackResult>
): Promise<ActionResult> {
  console.log('Starting attack execution:', { actor, state });
  
  const events: TurnEvent[] = [];
  let updatedState = { ...state };

  // Find target (for now, randomly select from player units)
  const playerUnits = state.units.filter(u => u.id.startsWith('player_') && u.hp > 0);
  if (playerUnits.length === 0) {
    console.log('No valid targets found');
    return { updatedState, events };
  }

  const target = playerUnits[Math.floor(Math.random() * playerUnits.length)];
  const damage = actor.attack || 0;
  
  console.log('Attack details:', { actor: actor.name, target: target.name, damage });

  // Apply damage
  let updatedTarget: TurnUnit = {
    ...target,
    hp: Math.max(0, (target.hp || 0) - damage)
  };

  // If unit died, trigger onDeath callback
  if (updatedTarget.hp === 0) {
    console.log('Unit defeated, triggering onDeath callback:', updatedTarget.name);
    
    if (onDeath) {
      const result = await onDeath(updatedTarget, updatedState);
      console.log('onDeath callback result:', result);
      
      if (result.wasResurrected) {
        console.log('Unit was resurrected:', result.updatedUnit);
        updatedTarget = result.updatedUnit;
        updatedState = result.updatedState;
      } else {
        console.log('Unit remains defeated:', updatedTarget.name);
      }
    } else {
      console.log('No onDeath callback provided');
    }
  }

  // Update state with modified target
  updatedState = {
    ...updatedState,
    units: updatedState.units.map(u => u.id === updatedTarget.id ? updatedTarget : u)
  };

  console.log('Attack execution completed');
  return { updatedState, events };
}

/**
 * Executes a wait action
 */
export function executeWait(
  actor: TurnUnit,
  state: TurnState
): ActionResult {
  console.log('Unit waiting:', actor.name);
  return {
    updatedState: state,
    events: []
  };
}

/**
 * Executes an ultimate action
 */
export async function executeUltimate(
  actor: TurnUnit,
  state: TurnState
): Promise<ActionResult> {
  console.log('Starting ultimate execution:', { actor: actor.name, energy: actor.energy });
  
  const events: TurnEvent[] = [];
  let updatedState = { ...state };

  const energyConsumed = actor.energy || 0;
  let updatedActor: TurnUnit = {
    ...actor,
    energy: 0
  };

  console.log('Ultimate execution completed');
  return { updatedState, events };
} 