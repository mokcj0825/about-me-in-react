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
async function executeAction(action: ScriptAction, context: ScriptContext): Promise<ScriptContext> {
  switch (action.type) {
    case 'attack': {
      const attacker = findUnitById(context, action.target) || { id: '', name: 'Unknown', attack: 0 };
      const targetIndex = Math.floor(Math.random() * context.playerUnits.length);
      const targetUnit = context.playerUnits[targetIndex] || null;
      if (!targetUnit) return context;

      const attackDamage = attacker.attack || 0;
      console.log(`${attacker.name} attacks ${targetUnit.name} with ${attackDamage} damage`);
      
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

      return updateUnitInContext(context, updatedUnit);
    }
    case 'ultimate':
    case 'cast_ultimate': {
      const unit = findUnitById(context, action.target);
      if (!unit) return context;

      const energyConsumed = unit.energy || 0;
      let updatedUnit = normalizeUnit({ ...unit, energy: 0 });

      if (context.blessings.length > 0) {
        try {
          const blessingData = await loadBlessing(context.blessings[0]);
          const battleContext: BattleContext = {
            consumedEnergy: energyConsumed
          };
          const result = await processBlessingEffects(updatedUnit, blessingData, battleContext) as EffectResult;
          updatedUnit = normalizeUnit(result.updatedUnit);
          return updateUnitInContext(context, updatedUnit);
        } catch (error) {
          console.error('Error processing blessing:', error);
        }
      }

      return updateUnitInContext(context, updatedUnit);
    }
    // Add more action types as needed
    default:
      console.warn(`Unknown action type: ${action.type}`);
      return context;
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

export async function loadScript(scriptId: string): Promise<ScriptLine[]> {
  try {
    const instructionData = await import(`../../instructions/${scriptId}.json`);
    return instructionData.default.test_sequence.map((step: any, index: number) => ({
      id: step.step,
      description: step.action.description,
      action: {
        type: step.action.type,
        target: step.action.actor,
        params: {
          expected_result: step.action.expected_result
        }
      }
    }));
  } catch (error) {
    console.error('Error loading script:', error);
    return [];
  }
}

export async function executeScriptLine(
  line: ScriptLine, 
  context: ScriptContext
): Promise<{ updatedContext: ScriptContext; descriptions: string[] }> {
  const descriptions: string[] = [];
  const updatedContext = await executeAction(line.action, context);
  return { updatedContext, descriptions };
} 