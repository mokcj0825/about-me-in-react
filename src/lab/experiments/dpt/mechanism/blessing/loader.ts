import { Blessing } from './types';
import { Buff, TurnState, TurnUnit } from '../../type/TurnSystem';

/**
 * Loads a blessing by ID
 */
export async function loadBlessing(id: string): Promise<Blessing> {
  const blessingData = await import(`../../data/${id}.json`);
  return blessingData as Blessing;
}

/**
 * Applies blessing buffs to the appropriate units
 */
export function applyBlessingBuffs(state: TurnState, blessing: Blessing): TurnState {
  const updatedUnits = state.units.map(unit => {
    // Only apply to units matching the blessing target
    if ((blessing.target === 'player' && unit.id.startsWith('player_')) ||
        (blessing.target === 'enemy' && !unit.id.startsWith('player_'))) {
      
      const buff: Buff = {
        id: `${blessing.id}_buff`,
        type: blessing.trigger.type === 'on_knockout' ? 'resurrection' : blessing.trigger.type,
        source: blessing.id,
        consumable: blessing.trigger.usage === 'once_per_battle_team',
        teamwide: blessing.trigger.usage === 'once_per_battle_team',
        effects: blessing.effects
      };

      return {
        ...unit,
        buffs: [...unit.buffs, buff]
      };
    }
    return unit;
  });

  return {
    ...state,
    units: updatedUnits
  };
} 