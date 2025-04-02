import { TurnState, TurnUnit, TurnEvent } from '../../../type/TurnSystem';
import { loadBlessing } from '../../blessing/loader';
import { processBlessingEffects } from '../../blessing/handler';

export interface UltimateContext {
  actor: TurnUnit;
  state: TurnState;
  usedBlessings: Set<string>;
}

export interface UltimateResult {
  updatedState: TurnState;
  events: TurnEvent[];
}

export async function handleUltimate({
  actor,
  state,
  usedBlessings
}: UltimateContext): Promise<UltimateResult> {
  const events: TurnEvent[] = [];
  let updatedState = { ...state };

  // Find target (randomly select from enemy units)
  const enemyUnits = updatedState.units.filter(u => !u.id.startsWith('player_') && u.hp > 0);
  if (enemyUnits.length === 0) {
    events.push({ 
      type: 'action', 
      unit: actor, 
      description: 'No valid targets found for ultimate' 
    });
    return { updatedState, events };
  }

  const target = enemyUnits[Math.floor(Math.random() * enemyUnits.length)];
  const energyCost = 120; // Default energy cost
  const baseDamage = actor.attack || 0;
  const ultimateMultiplier = 2.5;
  const damage = Math.floor(baseDamage * ultimateMultiplier);

  // Create new references for updated units
  let updatedUnit: TurnUnit = {
    ...actor,
    energy: Math.max(0, actor.energy - energyCost)
  };

  let updatedTarget: TurnUnit = {
    ...target,
    hp: Math.max(0, (target.hp || 0) - damage)
  };
  
  events.push({
    type: 'action',
    unit: updatedUnit,
    description: `${updatedUnit.name} uses Ultimate on ${target.name}, consuming ${energyCost} energy and dealing ${damage} damage`
  });

  // Process blessings that trigger after ultimate
  if (updatedState.blessings.length > 0) {
    for (const blessingId of updatedState.blessings) {
      try {
        const blessingData = await loadBlessing(blessingId);
        
        if (blessingData.trigger.type === 'after_ultimate' && 
            blessingData.target === 'player' &&
            updatedUnit.id.startsWith('player_')) {
          const { updatedUnit: blessedUnit, descriptions } = await processBlessingEffects(
            updatedUnit,
            blessingData,
            { consumedEnergy: energyCost, tempVars: {} }
          );
          
          // Create new reference for blessed unit
          updatedUnit = {
            ...updatedUnit,
            hp: blessedUnit.hp,
            maxHp: blessedUnit.maxHp,
            energy: blessedUnit.energy,
            maxEnergy: blessedUnit.maxEnergy
          };
          
          descriptions.forEach((desc: string) => 
            events.push({ type: 'effect', unit: updatedUnit, description: desc })
          );

          // Update state immediately after each blessing effect with new references
          updatedState = {
            ...updatedState,
            units: updatedState.units.map(u => 
              u.id === updatedUnit.id ? { ...updatedUnit } : { ...u }
            ),
            activeUnit: updatedUnit.id === updatedState.activeUnit?.id ? { ...updatedUnit } : updatedState.activeUnit ? { ...updatedState.activeUnit } : null
          };
        }
      } catch (error) {
        events.push({ 
          type: 'effect', 
          unit: updatedUnit, 
          description: `Error processing blessing: ${error instanceof Error ? error.message : String(error)}` 
        });
      }
    }
  }

  // Update state with new references for all units
  updatedState = {
    ...updatedState,
    units: updatedState.units.map(u => 
      u.id === updatedUnit.id ? { ...updatedUnit } :
      u.id === updatedTarget.id ? { ...updatedTarget } : { ...u }
    ),
    activeUnit: updatedUnit.id === updatedState.activeUnit?.id ? { ...updatedUnit } : updatedState.activeUnit ? { ...updatedState.activeUnit } : null
  };

  return { updatedState, events };
}
