import React, { useEffect, useState } from 'react';
import { BlessingPreview } from '../type/BlessingPreview';
import { InstructionData, Unit, UnitStrategy } from '../type/InstructionData';
import { TurnState, TurnUnit, TurnEvent, createTurnUnit } from '../type/TurnSystem';
import UnitCard from './UnitCard';
import { loadBlessing } from '../mechanism/blessing/loader';
import { processBlessingEffects } from '../mechanism/blessing/handler';
import { loadInstruction } from '../mechanism/instruction/loader';
import { TurnManager } from '../mechanism/turn/manager';

interface BattlefieldProps {
  blessingId?: string;
}

interface ActionLog {
  message: string;
  timestamp: number;
  type?: 'turn' | 'action' | 'effect' | 'system';
}

function selectAction(unit: TurnUnit): string {
  if (!unit.strategy) return 'wait';

  // For aggressive units, prioritize attack actions
  if (unit.strategy.type === 'aggressive') {
    const attackAction = unit.strategy.actions.find(a => a.type === 'attack');
    if (attackAction) {
      return `attack:${attackAction.target}`;
    }
  }

  // For passive units, check for ultimate if energy is sufficient
  if (unit.strategy.type === 'passive') {
    const ultimateAction = unit.strategy.actions.find(a => a.type === 'ultimate');
    if (ultimateAction && (!ultimateAction.energy_threshold || (unit.energy || 0) >= ultimateAction.energy_threshold)) {
      return 'ultimate';
    }
  }

  // Default to wait if no other actions are available
  return 'wait';
}

export function Battlefield({ blessingId }: BattlefieldProps): React.ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [turnManager, setTurnManager] = useState<TurnManager | null>(null);
  const [battleState, setBattleState] = useState<TurnState | null>(null);
  const [stateVersion, setStateVersion] = useState<number>(0);
  const [isStepInProgress, setIsStepInProgress] = useState<boolean>(false);

  // Helper to add logs
  const addLog = (message: string, type: ActionLog['type'] = 'action') => {
    setLogs(prev => [...prev, {
      message,
      timestamp: Date.now(),
      type
    }]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const executeStep = async () => {
    if (!turnManager || !battleState || isStepInProgress) return;

    try {
      setIsStepInProgress(true);
      
      // Process the turn
      const result = await turnManager.processTurn();
      const { newState, events } = result;
      
      // Log turn events and debug state changes
      events.forEach((event: TurnEvent) => {
        const type = event.type === 'turn_start' || event.type === 'turn_end' ? 'turn' : 
                    event.type === 'action' ? 'action' : 'effect';
        addLog(event.description, type);
        
        // Debug log for state changes
        if (event.type === 'effect' && event.unit) {
          addLog(`Debug - Unit ${event.unit.id} state: HP=${event.unit.hp}/${event.unit.maxHp}`, 'system');
        }
      });

      // Queue next action for the active unit if it can still act
      if (newState.activeUnit && newState.activeUnit.canAct) {
        const actionType = selectAction(newState.activeUnit);
        turnManager.queueAction(newState.activeUnit, actionType);
      }

      // Create a new state object with deep cloning of units
      const updatedState: TurnState = {
        turnCount: newState.turnCount,
        isPaused: newState.isPaused,
        blessings: [...newState.blessings],
        activeUnit: newState.activeUnit ? { ...newState.activeUnit } : null,
        units: newState.units.map(unit => {
          // Find the most recent version of this unit from events
          const latestUnitEvent = [...events].reverse().find(
            event => event.type === 'effect' && event.unit && event.unit.id === unit.id
          );

          // Use the most recent unit state if available
          const baseUnit = latestUnitEvent?.unit || unit;

          return {
            ...baseUnit,
            statusEffects: [...(baseUnit.statusEffects || [])],
            strategy: baseUnit.strategy ? {
              type: baseUnit.strategy.type,
              actions: [...baseUnit.strategy.actions]
            } : undefined
          };
        })
      };

      // Debug log the state update
      addLog(`Debug - State update: Version ${stateVersion + 1}`, 'system');
      updatedState.units.forEach(unit => {
        addLog(`Debug - Updated unit ${unit.id}: HP=${unit.hp}/${unit.maxHp}`, 'system');
      });

      // Force React to recognize the state change
      setStateVersion(prev => prev + 1);
      setBattleState(updatedState);
      
    } catch (error) {
      addLog(`Error executing step: ${error instanceof Error ? error.message : String(error)}`, 'system');
    } finally {
      setIsStepInProgress(false);
    }
  };

  const initializeBattle = async () => {
    if (!blessingId) return;
    
    try {
      setIsLoading(true);
      setLogs([]);
      
      // Load instruction data for initial setup
      const instruction = await loadInstruction(blessingId);
      
      // Create turn units from instruction data
      const units: TurnUnit[] = [
        ...instruction.setup.player_units.map(u => createTurnUnit(u)),
        ...instruction.setup.enemy_units.map(u => createTurnUnit(u))
      ];

      const initialState: TurnState = {
        units,
        activeUnit: null,
        turnCount: 0,
        isPaused: false,
        blessings: instruction.setup.blessings
      };

      const newTurnManager = new TurnManager(initialState);
      
      // Queue initial actions for all units
      units.forEach(unit => {
        const actionType = selectAction(unit);
        newTurnManager.queueAction(unit, actionType);
      });
      
      setTurnManager(newTurnManager);
      setBattleState(initialState);
      
      addLog('=== Battle Initialized ===', 'system');
      addLog(`Available blessings: ${initialState.blessings.join(', ')}`, 'system');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to initialize battle');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (blessingId) {
      initializeBattle();
    }
  }, [blessingId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.root} key={`battlefield-${stateVersion}`}>      
      <div style={styles.unitsContainer}>
        <div style={styles.unitSection}>
          <h3>Player Units</h3>
          <div style={styles.unitList}>
            {battleState?.units
              .filter(u => u.id.startsWith('player_'))
              .map((unit) => (
                <UnitCard 
                  key={`${unit.id}-${stateVersion}`}
                  unit={unit}
                  isPlayerUnit={true}
                  isActive={unit.id === battleState.activeUnit?.id}
                />
            ))}
          </div>
        </div>

        <div style={styles.unitSection}>
          <h3>Enemy Units</h3>
          <div style={styles.unitList}>
            {battleState?.units
              .filter(u => u.id.startsWith('enemy_'))
              .map((unit) => (
                <UnitCard 
                  key={`${unit.id}-${stateVersion}`}
                  unit={unit}
                  isPlayerUnit={false}
                  isActive={unit.id === battleState.activeUnit?.id}
                />
            ))}
          </div>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.controls}>
            <button 
              onClick={initializeBattle} 
              style={styles.button}
              disabled={isLoading}
            >
              Reset Battle
            </button>
            <button
              onClick={executeStep}
              style={{
                ...styles.button,
                marginLeft: '10px',
                background: '#2196F3'
              }}
              disabled={isStepInProgress}
            >
              Next Step
            </button>
            <button
              onClick={clearLogs}
              style={{
                ...styles.button,
                marginLeft: '10px',
                background: '#757575'
              }}
            >
              Clear Log
            </button>
          </div>
        </div>

        <div style={styles.logContainer}>
          {logs.map((log, index) => (
            <div 
              key={`${log.timestamp}-${index}`} 
              style={{
                ...styles.logEntry,
                ...(log.type === 'turn' ? styles.turnLog : {}),
                ...(log.type === 'effect' ? styles.effectLog : {}),
                ...(log.type === 'system' ? styles.systemLog : {})
              }}
            >
              {log.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    padding: '20px',
    height: 'calc(100vh - 40px)',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  unitsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    minHeight: '200px'
  },
  unitSection: {
    display: 'flex',
    flexDirection: 'column' as const
  },
  unitList: {
    padding: '10px',
    background: '#fff',
    borderRadius: '4px'
  },
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    flex: 1
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px'
  },
  controls: {
    display: 'flex',
    alignItems: 'center'
  },
  button: {
    padding: '8px 16px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  logContainer: {
    fontFamily: 'monospace',
    background: '#1e1e1e',
    color: '#fff',
    padding: '15px',
    borderRadius: '4px',
    height: '400px',
    overflowY: 'auto' as const
  },
  logEntry: {
    padding: '4px 8px',
    borderLeft: '3px solid transparent'
  },
  turnLog: {
    color: '#64B5F6',
    borderLeftColor: '#2196F3',
    fontWeight: 'bold'
  },
  effectLog: {
    color: '#81C784',
    borderLeftColor: '#4CAF50'
  },
  systemLog: {
    color: '#FFB74D',
    borderLeftColor: '#FF9800',
    fontStyle: 'italic'
  }
};

export default Battlefield; 