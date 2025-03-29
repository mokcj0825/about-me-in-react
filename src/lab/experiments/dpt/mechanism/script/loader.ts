import { Unit } from '../../type/InstructionData';
import { ScriptContext } from '../../type/ScriptContext';
import { processBlessingEffects } from '../blessing/handler';
import { loadBlessing } from '../blessing/loader';

export interface ScriptAction {
  type: string;
  target: string;
  params: Record<string, unknown>;
}

export interface ScriptLine {
  id: number;
  description: string;
  action: ScriptAction;
}

interface BattleContext {
  consumedEnergy?: number;
  incomingDamage?: number;
  sourceId?: string;
}

interface EffectResult {
  updatedUnit: Unit;
  descriptions: string[];
}

function normalizeUnit(unit: Unit): Unit {
  return {
    ...unit,
    energy: unit.energy || 0,
    maxEnergy: unit.maxEnergy || 0,
    attack: unit.attack || 0,
    hp: unit.hp || 0,
    maxHp: unit.maxHp || 0
  };
}

/**
 * Executes a script action based on its type
 */
async function executeAction(action: ScriptAction, context: ScriptContext): Promise<{ context: ScriptContext; descriptions: string[] }> {
  const descriptions: string[] = [];
  
  switch (action.type) {
    case 'attack': {
      const attacker = findUnitById(context, action.target) || { id: '', name: 'Unknown', attack: 0 };
      const targetIndex = Math.floor(Math.random() * context.playerUnits.length);
      const targetUnit = context.playerUnits[targetIndex] || null;
      if (!targetUnit) return { context, descriptions };

      const attackDamage = attacker.attack || 0;
      descriptions.push(`${attacker.name} attacks ${targetUnit.name} with ${attackDamage} damage`);
      
      let updatedUnit = normalizeUnit({ 
        ...targetUnit, 
        hp: Math.max(0, targetUnit.hp - attackDamage)
      });
      
      if (context.blessings.length > 0 && updatedUnit.hp <= 0) {
        try {
          const blessingData = await loadBlessing(context.blessings[0]);
          const battleContext: BattleContext = {
            consumedEnergy: updatedUnit.energy,
            incomingDamage: attackDamage,
            sourceId: attacker.id
          };
          
          const result = await processBlessingEffects(updatedUnit, blessingData, battleContext) as EffectResult;
          updatedUnit = normalizeUnit(result.updatedUnit);
          descriptions.push(...result.descriptions);
            
          if (updatedUnit.hp > 0) {
            context = {
              ...context,
              blessings: context.blessings.slice(1)
            };
          }
        } catch (error) {
          console.error('Error processing blessing:', error);
        }
      }

      return { 
        context: updateUnitInContext(context, updatedUnit),
        descriptions
      };
    }
    case 'ultimate':
    case 'cast_ultimate': {
      const unit = findUnitById(context, action.target);
      if (!unit) return { context, descriptions };

      const energyConsumed = unit.energy || 0;
      let updatedUnit = normalizeUnit({ ...unit, energy: 0 });
      descriptions.push(`${unit.name} casts ultimate, consuming ${energyConsumed} energy`);

      if (context.blessings.length > 0) {
        try {
          const blessingData = await loadBlessing(context.blessings[0]);
          const battleContext: BattleContext = {
            consumedEnergy: energyConsumed
          };
          const result = await processBlessingEffects(updatedUnit, blessingData, battleContext) as EffectResult;
          updatedUnit = normalizeUnit(result.updatedUnit);
          descriptions.push(...result.descriptions);
          return { 
            context: updateUnitInContext(context, updatedUnit),
            descriptions
          };
        } catch (error) {
          console.error('Error processing blessing:', error);
        }
      }

      return { 
        context: updateUnitInContext(context, updatedUnit),
        descriptions
      };
    }
    // Add more action types as needed
    default:
      console.warn(`Unknown action type: ${action.type}`);
      return { context, descriptions };
  }
}

function findUnitById(context: ScriptContext, unitId: string): Unit | undefined {
  return [...context.playerUnits, ...context.enemyUnits].find(u => u.id === unitId);
}

function updateUnitInContext(context: ScriptContext, updatedUnit: Unit): ScriptContext {
  const isPlayerUnit = context.playerUnits.some(u => u.id === updatedUnit.id);
  
  if (isPlayerUnit) {
    return {
      ...context,
      playerUnits: context.playerUnits.map(u => u.id === updatedUnit.id ? updatedUnit : u)
    };
  }

  return {
    ...context,
    enemyUnits: context.enemyUnits.map(u => u.id === updatedUnit.id ? updatedUnit : u)
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

export async function loadScript(scriptId: string): Promise<ScriptData> {
  try {
    const instructionData = await import(`../../instructions/${scriptId}.json`);
    const testSequence = Array.isArray(instructionData.default.test_sequence) 
      ? instructionData.default.test_sequence 
      : [];

    const scriptLines = testSequence.map((step: any) => ({
      id: step.step,
      description: step.action.description || '',
      action: {
        type: step.action.type,
        target: step.action.actor,
        params: {
          expected_result: step.action.expected_result
        }
      }
    }));

    // Deep clone the initial setup to prevent reference issues
    const initialSetup = {
      player_units: (instructionData.default.setup.player_units || []).map((unit: Unit) => ({...unit})),
      enemy_units: (instructionData.default.setup.enemy_units || []).map((unit: Unit) => ({...unit})),
      blessings: [...(instructionData.default.setup.blessings || [])]
    };

    return {
      scriptLines,
      initialSetup
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

export async function executeScriptLine(
  line: ScriptLine, 
  context: ScriptContext
): Promise<{ updatedContext: ScriptContext; descriptions: string[] }> {
  const result = await executeAction(line.action, context);
  return { 
    updatedContext: result.context,
    descriptions: result.descriptions
  };
}

export function createInitialContext(setup: ScriptData['initialSetup']): ScriptContext {
  return {
    playerUnits: setup.player_units.map(unit => normalizeUnit({...unit})),
    enemyUnits: setup.enemy_units.map(unit => normalizeUnit({...unit})),
    blessings: [...setup.blessings],
    currentLine: 0
  };
} 