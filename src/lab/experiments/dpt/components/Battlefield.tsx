import React, { useEffect, useState } from 'react';
import { BlessingPreview } from '../type/BlessingPreview';
import { InstructionData, Unit } from '../type/InstructionData';
import { TurnState, TurnUnit, TurnEvent } from '../type/TurnSystem';
import UnitCard from './UnitCard';
import TestSequence from './TestSequence';
import { loadInstruction } from '../mechanism/instruction/loader';
import { loadScript, executeScriptLine, ScriptLine, ScriptData, createInitialContext } from '../mechanism/script/loader';
import { TurnManager } from '../mechanism/turn/manager';

interface BattlefieldProps {
  blessingId?: string;
}

interface ActionLog {
  message: string;
  timestamp: number;
  type?: 'turn' | 'action' | 'effect' | 'system';
}

export function Battlefield({ blessingId }: BattlefieldProps): React.ReactElement {
  const [instruction, setInstruction] = useState<InstructionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [scriptLines, setScriptLines] = useState<ScriptLine[]>([]);
  const [currentScriptLine, setCurrentScriptLine] = useState<number>(0);
  const [turnManager, setTurnManager] = useState<TurnManager | null>(null);

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

  const executeNextStep = async () => {
    if (!turnManager || currentScriptLine >= scriptLines.length) return;

    try {
      // Process the turn
      const { newState, events } = turnManager.processTurn();
      
      // Log turn events with appropriate styling
      events.forEach(event => {
        const type = event.type === 'turn_start' || event.type === 'turn_end' ? 'turn' : 
                    event.type === 'action' ? 'action' : 'effect';
        addLog(event.description, type);
      });

      // Get the current script line
      const line = scriptLines[currentScriptLine];
      const actor = newState.units.find(u => u.id === line.action.actor);

      if (!actor) {
        addLog(`Error: Could not find actor ${line.action.actor}`, 'system');
        return;
      }

      // Queue the action from the script
      turnManager.queueAction(actor, line.action.type);
      
      // Execute the script line
      const { updatedContext, descriptions } = await executeScriptLine(line, newState);
      
      // Update turn manager with the new state
      turnManager.setState(updatedContext);
      
      // Log action results
      descriptions.forEach(desc => addLog(desc));

      // Update instruction setup with the latest unit states
      if (instruction) {
        const updatedInstruction = {
          ...instruction,
          setup: {
            ...instruction.setup,
            player_units: updatedContext.units.filter(u => u.id.startsWith('player_')),
            enemy_units: updatedContext.units.filter(u => u.id.startsWith('enemy_')),
            blessings: updatedContext.blessings
          }
        };
        setInstruction(updatedInstruction);
      }

      // Move to next script line
      setCurrentScriptLine(prev => prev + 1);

    } catch (error) {
      addLog(`Error executing step: ${error instanceof Error ? error.message : String(error)}`, 'system');
    }
  };

  const runScript = async () => {
    if (!blessingId) return;
    
    try {
      // Reset instruction and load script
      const [resetInstruction, scriptData] = await Promise.all([
        loadInstruction(blessingId),
        loadScript(blessingId)
      ]);
      
      setInstruction(resetInstruction);
      setScriptLines(scriptData.scriptLines);
      
      // Create new turn manager with initial state
      const initialContext = createInitialContext(scriptData.initialSetup);
      const newTurnManager = new TurnManager(initialContext);
      setTurnManager(newTurnManager);
      setCurrentScriptLine(0);
      
      addLog('=== Starting Script Execution ===', 'system');
      addLog(`Available blessings: ${initialContext.blessings.join(', ')}`, 'system');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reset script');
    }
  };

  // Initial load
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      if (!blessingId) return;

      setInstruction(null);
      setError(null);
      setIsLoading(true);
      setLogs([]);
      setCurrentScriptLine(0);
      setScriptLines([]);
      setTurnManager(null);

      try {
        const [instructionData, scriptData] = await Promise.all([
          loadInstruction(blessingId),
          loadScript(blessingId)
        ]);

        if (isMounted) {
          setInstruction(instructionData);
          setScriptLines(scriptData.scriptLines);
          const initialContext = createInitialContext(scriptData.initialSetup);
          const newTurnManager = new TurnManager(initialContext);
          setTurnManager(newTurnManager);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, [blessingId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!instruction) return <div>No data available</div>;

  const battleState = turnManager?.getState();

  return (
    <div style={styles.root}>      
      <div style={styles.unitsContainer}>
        <div style={styles.unitSection}>
          <h3>Player Units</h3>
          <div style={styles.unitList}>
            {battleState?.units
              .filter(u => u.id.startsWith('player_'))
              .map((unit, index) => (
                <UnitCard 
                  key={`player-${index}`} 
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
              .map((unit, index) => (
                <UnitCard 
                  key={`enemy-${index}`} 
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
              onClick={runScript} 
              style={styles.button}
              disabled={!instruction || currentScriptLine === scriptLines.length}
            >
              Reset Script
            </button>
            <button 
              onClick={executeNextStep} 
              style={{
                ...styles.button,
                marginLeft: '10px',
                background: '#2196F3'
              }}
              disabled={!turnManager || currentScriptLine >= scriptLines.length}
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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