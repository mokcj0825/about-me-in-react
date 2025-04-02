import { TurnState, TurnUnit, TurnEvent } from '../../../type/TurnSystem';
import { loadBlessing } from '../../blessing/loader';
import { processBlessingEffects } from '../../blessing/handler';

export interface AttackContext {
  actor: TurnUnit;
  targetId: string;
  state: TurnState;
  usedBlessings: Set<string>;
}

export interface AttackResult {
  updatedState: TurnState;
  events: TurnEvent[];
}

export async function handleAttack({
  actor,
  targetId,
  state,
  usedBlessings
}: AttackContext): Promise<AttackResult> {
  const events: TurnEvent[] = [];
  let updatedState = { ...state };

  const target = updatedState.units.find(u => u.id === targetId);
  if (!target) {
    return { updatedState, events };
  }

  const damage = actor.attack || 100; // Default damage if not specified
  let updatedTarget = {
    ...target,
    hp: Math.max(0, target.hp - damage)
  };
  
  events.push({
    type: 'action',
    unit: actor,
    target: updatedTarget,
    description: `${actor.name} attacks ${target.name} for ${damage} damage`
  });

  // Process blessing effects if target is a player unit and hasn't used blessing yet
  if (target.id.startsWith('player_') && updatedState.blessings.length > 0) {
    for (const blessingId of updatedState.blessings) {
      // Skip if this blessing has already been used
      if (usedBlessings.has(blessingId)) continue;

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
          usedBlessings.add(blessingId);
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

  return { updatedState, events };
}
