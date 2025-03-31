import { InstructionData, Unit } from '../../type/InstructionData';
import { TurnState, TurnUnit, TurnEvent, createTurnUnit } from '../../type/TurnSystem';
import { executeAttack, executeWait, executeUltimate, ActionResult, DeathCallbackResult } from '../turn/actions';
import { loadBlessing } from '../blessing/loader';
import { processBlessingEffects } from '../blessing/handler';

export interface ScriptLine {
  id: string;
  description: string;
  action: {
    type: string;
    actor: string;
    target?: string;
  };
}

export interface ScriptData {
  scriptLines: ScriptLine[];
  initialSetup: {
    player_units: Unit[];
    enemy_units: Unit[];
    blessings: string[];
  };
}

/**
 * Loads script data from instruction
 */
export async function loadScript(blessingId: string): Promise<ScriptData> {
  try {
    const instructionData: InstructionData = await import(
      `../../instructions/${blessingId}.json`
    ).then(module => module.default);
    
    // Convert test sequence into script lines
    const scriptLines = instructionData.test_sequence.map((step, index) => ({
      id: `step_${index + 1}`,
      description: step.action.description,
      action: {
        type: step.action.type,
        actor: step.action.actor || step.expected_actor // Handle both formats
      }
    }));

    return {
      scriptLines,
      initialSetup: instructionData.setup
    };
  } catch (error) {
    console.error('Error loading script:', error);
    return {
      scriptLines: [],
      initialSetup: {
        player_units: [],
        enemy_units: [],
        blessings: []
      }
    };
  }
}

/**
 * Creates initial turn state from script data
 */
export function createInitialContext(setup: ScriptData['initialSetup']): TurnState {
  const playerUnits = setup.player_units.map(unit => createTurnUnit(unit));
  const enemyUnits = setup.enemy_units.map(unit => createTurnUnit(unit));
  
  return {
    units: [...playerUnits, ...enemyUnits],
    activeUnit: null,
    turnCount: 0,
    isPaused: false,
    blessings: [...setup.blessings]
  };
}

/**
 * Handles unit death and potential resurrection
 */
async function handleUnitDeath(unit: TurnUnit, state: TurnState): Promise<DeathCallbackResult> {
  console.log('Handling unit death:', { unit: unit.name, blessings: state.blessings });
  
  // Check for resurrection blessing
  if (state.blessings.length > 0 && unit.id.startsWith('player_')) {
    const blessingId = state.blessings[0];
    try {
      const blessingData = await loadBlessing(blessingId);
      
      if (blessingData.trigger.type === 'on_knockout' && 
          blessingData.target === 'player') {
        console.log('Processing resurrection blessing:', blessingId);
        
        const { updatedUnit, descriptions } = await processBlessingEffects(
          unit,
          blessingData,
          {}
        );

        // If unit was resurrected (HP > 0)
        if (updatedUnit.hp > 0) {
          console.log('Resurrection successful:', { unit: updatedUnit.name, hp: updatedUnit.hp });
          
          // Create new state with empty blessings
          const updatedState = {
            ...state,
            blessings: []  // Remove blessing after successful resurrection
          };
          console.log('Removed blessing after resurrection, new state:', updatedState);

          const resurrectedUnit: TurnUnit = {
            ...updatedUnit,
            actionValue: unit.actionValue,
            baseActionValue: unit.baseActionValue,
            statusEffects: unit.statusEffects,
            canAct: unit.canAct,
            buffs: unit.buffs
          };

          return {
            wasResurrected: true,
            updatedUnit: resurrectedUnit,
            updatedState
          };
        }
      }
    } catch (error) {
      console.error('Error processing resurrection:', error);
    }
  }

  console.log('No resurrection occurred');
  return {
    wasResurrected: false,
    updatedUnit: unit,
    updatedState: state
  };
}

/**
 * Execute a script line in the turn-based system
 */
export async function executeScriptLine(
  line: ScriptLine,
  context: TurnState
): Promise<{ updatedContext: TurnState; descriptions: string[] }> {
  console.log('Executing script line with context:', { 
    line, 
    blessings: context.blessings,
    turnCount: context.turnCount 
  });

  // Find the actor
  const actor = context.units.find(u => u.id === line.action.actor);
  if (!actor) {
    return {
      updatedContext: context,
      descriptions: [`Error: Could not find actor ${line.action.actor}`]
    };
  }

  let result: ActionResult;

  // Execute the appropriate action
  try {
    switch (line.action.type) {
      case 'attack':
        result = await executeAttack(actor, context, handleUnitDeath);
        break;
      case 'wait':
        result = executeWait(actor, context);
        break;
      case 'ultimate':
        result = await executeUltimate(actor, context);
        break;
      default:
        return {
          updatedContext: context,
          descriptions: [`Unknown action type: ${line.action.type}`]
        };
    }

    console.log('Action result:', { 
      actionType: line.action.type,
      blessingsBeforeUpdate: context.blessings,
      blessingsAfterUpdate: result.updatedState.blessings
    });

    // Return the updated context
    return {
      updatedContext: result.updatedState,
      descriptions: result.events.map(event => event.description)
    };
  } catch (error) {
    console.error('Error executing action:', error);
    return {
      updatedContext: context,
      descriptions: [`Error executing ${line.action.type}: ${error instanceof Error ? error.message : String(error)}`]
    };
  }
}