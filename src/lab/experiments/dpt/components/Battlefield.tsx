import React, { useEffect, useState } from 'react';
import { BlessingPreview } from '../type/BlessingPreview';
import { InstructionData, Unit } from '../type/InstructionData';
import UnitCard from './UnitCard';
import TestSequence from './TestSequence';
import { executeEnemyAttack } from '../mechanism/action/execute';
import { KnockoutEvent } from '../mechanism/event/knockout';

interface BattlefieldProps {
  blessingId?: string;
}

interface ActionLog {
  message: string;
  timestamp: number;
}

interface ScriptContext {
  playerUnits: Unit[];
  enemyUnits: Unit[];
  blessings: string[];
  currentLine: number;
}

interface ScriptLine {
  id: number;
  description: string;
  execute: (context: ScriptContext) => Promise<ScriptContext>;
}

export function Battlefield({ blessingId }: BattlefieldProps): React.ReactElement {
  const [instruction, setInstruction] = useState<InstructionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [scriptContext, setScriptContext] = useState<ScriptContext | null>(null);
  const [currentScriptLine, setCurrentScriptLine] = useState<number>(0);
  const [showTestSequence, setShowTestSequence] = useState<boolean>(false);

  // Helper to add logs
  const addLog = (message: string) => {
    setLogs(prev => [...prev, {
      message,
      timestamp: Date.now()
    }]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // Event handlers
  const onKnockout = async (event: KnockoutEvent, context: ScriptContext): Promise<ScriptContext> => {
    addLog(`KNOCKOUT: ${event.unit.name} was knocked out by ${event.attacker.name}!`);
    
    if (context.blessings.length > 0) {
      addLog('Checking for resurrection blessings...');
      const blessingUsed = context.blessings[0];
      const updatedBlessings = context.blessings.slice(1);
      
      addLog(`Using blessing: ${blessingUsed} for resurrection`);

      // Get current energy before consumption
      const currentEnergy = event.unit.energy || 0;
      const maxEnergy = event.unit.maxEnergy || 100;
      
      // Load blessing data to get effect values
      const blessingData = await import(/* webpackMode: "eager" */ `../data/${blessingUsed}.json`);
      const consumeEffect = blessingData.default.effects.find(
        (effect: { type: string }) => effect.type === 'consume_resource'
      );
      const healEffect = blessingData.default.effects.find(
        (effect: { type: string }) => effect.type === 'heal'
      );

      // Calculate energy to consume based on measurement type
      const energyToConsume = consumeEffect?.measurement === 'percentage'
        ? Math.floor((currentEnergy * consumeEffect.amount) / 100)
        : consumeEffect?.amount || 0;

      const healingMultiplier = healEffect?.value?.multiplier || 0;
      
      if (currentEnergy <= 0) {
        addLog(`Warning: Unit has no energy to consume`);
        return context; // Cannot resurrect if no energy
      }

      addLog(`Consuming ${energyToConsume} energy (${consumeEffect?.amount}% of current energy: ${currentEnergy}) for resurrection`);

      const healingAmount = Math.floor(energyToConsume * healingMultiplier);
      addLog(`Healing amount (${healingMultiplier * 100}% of consumed energy): ${healingAmount}`);

      const resurrectedUnit = {
        ...event.unit,
        hp: healingAmount,
        energy: currentEnergy - energyToConsume
      };

      const updatedPlayerUnits = context.playerUnits.map(unit => 
        unit.id === resurrectedUnit.id ? resurrectedUnit : unit
      );

      const newContext = {
        ...context,
        playerUnits: updatedPlayerUnits,
        blessings: updatedBlessings
      };

      addLog(`${event.unit.name} has been resurrected with ${resurrectedUnit.hp} HP! (Energy consumed: ${energyToConsume}, Remaining energy: ${resurrectedUnit.energy})`);
      return newContext;
    }

    addLog('No resurrection blessings available.');
    return context;
  };

  // Define script lines
  const scriptLines: ScriptLine[] = [
    {
      id: 0,
      description: 'Enemy A attacks player unit',
      execute: async (context: ScriptContext) => {
        addLog('\n=== Enemy A attacks ===');
        const enemyA = context.enemyUnits[0];
        const playerTarget = context.playerUnits[0];
        
        const attack = executeEnemyAttack(enemyA, playerTarget, context.blessings.length > 0);
        addLog(attack.description);

        let updatedContext = {
          ...context,
          playerUnits: [attack.targetUnit, ...context.playerUnits.slice(1)]
        };

        if (attack.knockoutEvent) {
          updatedContext = await onKnockout(attack.knockoutEvent, updatedContext);
        }

        return updatedContext;
      }
    },
    {
      id: 1,
      description: 'Enemy B attacks player unit',
      execute: async (context: ScriptContext) => {
        addLog('\n=== Enemy B attacks ===');
        const enemyB = context.enemyUnits[1];
        const playerTarget = context.playerUnits[0];
        
        const attack = executeEnemyAttack(enemyB, playerTarget, context.blessings.length > 0);
        addLog(attack.description);

        let updatedContext = {
          ...context,
          playerUnits: [attack.targetUnit, ...context.playerUnits.slice(1)]
        };

        if (attack.knockoutEvent) {
          updatedContext = await onKnockout(attack.knockoutEvent, updatedContext);
        }

        return updatedContext;
      }
    }
  ];

  const executeNextLine = async () => {
    if (!scriptContext || currentScriptLine >= scriptLines.length) return;

    const line = scriptLines[currentScriptLine];
    const updatedContext = await line.execute(scriptContext);
    
    // Update instruction setup with the latest unit states
    if (instruction) {
      const updatedInstruction = {
        ...instruction,
        setup: {
          ...instruction.setup,
          player_units: updatedContext.playerUnits,
          enemy_units: updatedContext.enemyUnits,
          blessings: updatedContext.blessings
        }
      };
      setInstruction(updatedInstruction);
    }
    
    setScriptContext(updatedContext);
    setCurrentScriptLine(prev => prev + 1);
  };

  const runScript = async () => {
    const initialContext: ScriptContext = {
      playerUnits: instruction?.setup.player_units || [],
      enemyUnits: instruction?.setup.enemy_units || [],
      blessings: instruction?.setup.blessings || [],
      currentLine: 0
    };

    // Reset instruction to initial state when resetting script
    if (instruction) {
      const resetInstruction = await import(/* webpackMode: "eager" */ `../instructions/${blessingId}.json`);
      setInstruction(resetInstruction.default);
    }

    setScriptContext(initialContext);
    setCurrentScriptLine(0);
    addLog('=== Starting Script Execution ===');
    addLog(`Available blessings: ${initialContext.blessings.join(', ')}`);
  };

  // Load instruction data
  useEffect(() => {
    let isMounted = true;

    setInstruction(null);
    setError(null);
    setIsLoading(true);
    setLogs([]);
    setScriptContext(null);
    setCurrentScriptLine(0);

    const loadBattlefieldData = async () => {
      try {
        const instructionData = await import(/* webpackMode: "eager" */ `../instructions/${blessingId}.json`);
        if (isMounted) {
          setInstruction(instructionData.default);
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

    if (blessingId) {
      loadBattlefieldData();
    }

    return () => {
      isMounted = false;
    };
  }, [blessingId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!instruction) return <div>No data available</div>;

  return (
    <div style={styles.root}>      
      <div style={styles.unitsContainer}>
        <div style={styles.unitSection}>
          <h3>Player Units</h3>
          <div style={styles.unitList}>
            {instruction.setup.player_units.map((unit, index) => (
              <UnitCard key={`player-${index}`} unit={unit} isPlayerUnit={true} />
            ))}
          </div>
        </div>
        
        <div style={styles.unitSection}>
          <h3>Enemy Units</h3>
          <div style={styles.unitList}>
            {instruction.setup.enemy_units.map((unit, index) => (
              <UnitCard key={`enemy-${index}`} unit={unit} isPlayerUnit={false} />
            ))}
          </div>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h3>Script Execution</h3>
            <div 
              style={{
                ...styles.infoIcon,
                background: showTestSequence ? '#e3f2fd' : 'transparent'
              }}
              onClick={() => setShowTestSequence(!showTestSequence)}
              role="button"
              tabIndex={0}
            >
              ℹ️
              {showTestSequence && (
                <div 
                  style={styles.testSequencePopup}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={styles.popupHeader}>
                    <h4 style={{ margin: 0 }}>Test Sequence</h4>
                    <button
                      onClick={() => setShowTestSequence(false)}
                      style={styles.closeButton}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={styles.popupContent}>
                    <TestSequence steps={instruction.test_sequence} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div style={styles.controls}>
            <button 
              onClick={runScript} 
              style={styles.button}
              disabled={!instruction || scriptContext?.currentLine === scriptLines.length}
            >
              Reset Script
            </button>
            <button 
              onClick={executeNextLine} 
              style={{
                ...styles.button,
                marginLeft: '10px',
                background: '#2196F3'
              }}
              disabled={!scriptContext || currentScriptLine >= scriptLines.length}
            >
              Next Line
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

        <div style={styles.scriptContainer}>
          <div style={styles.scriptLines}>
            {scriptLines.map((line, index) => (
              <div 
                key={line.id}
                style={{
                  ...styles.scriptLine,
                  ...(index === currentScriptLine ? styles.currentLine : {}),
                  ...(index < currentScriptLine ? styles.completedLine : {})
                }}
              >
                {line.description}
              </div>
            ))}
          </div>
          
          <div style={styles.logContainer}>
            {logs.map((log, index) => (
              <div key={`${log.timestamp}-${index}`} style={styles.logEntry}>
                {log.message}
              </div>
            ))}
          </div>
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
    height: 'calc(100vh - 40px)', // Full viewport height minus padding
    maxWidth: '1200px',
    margin: '0 auto',
    overflow: 'hidden' // Prevent double scrollbars
  },
  unitsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    minHeight: '200px',
    maxHeight: '30vh',
    overflow: 'hidden'
  },
  unitSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden'
  },
  unitList: {
    overflowY: 'auto' as const,
    padding: '10px',
    background: '#fff',
    borderRadius: '4px',
    flex: 1
  },
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '20px',
    background: '#f5f5f5',
    borderRadius: '8px',
    flex: 1,
    minHeight: 0, // Important for flex container
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexShrink: 0 // Prevent header from shrinking
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
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
  scriptContainer: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '20px',
    flex: 1,
    minHeight: 0, // Important for grid container
    overflow: 'hidden'
  },
  scriptLines: {
    background: '#fff',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    overflowY: 'auto' as const
  },
  scriptLine: {
    padding: '10px',
    margin: '5px 0',
    borderRadius: '4px',
    background: '#f8f9fa',
    border: '1px solid #e9ecef'
  },
  currentLine: {
    background: '#e3f2fd',
    borderColor: '#2196F3',
    fontWeight: 'bold' as const
  },
  completedLine: {
    background: '#e8f5e9',
    borderColor: '#4CAF50',
    color: '#2e7d32'
  },
  logContainer: {
    fontFamily: 'monospace',
    background: '#1e1e1e',
    color: '#fff',
    padding: '15px',
    borderRadius: '4px',
    overflowY: 'auto' as const
  },
  logEntry: {
    margin: '5px 0',
    whiteSpace: 'pre-wrap' as const
  },
  infoIcon: {
    position: 'relative' as const,
    cursor: 'pointer',
    fontSize: '18px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    ':hover': {
      background: '#f5f5f5'
    },
    outline: 'none'
  },
  testSequencePopup: {
    position: 'absolute' as const,
    top: 'calc(100% + 5px)',
    left: '0',
    transform: 'translateX(-50%)',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    zIndex: 1000,
    minWidth: '300px',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column' as const
  },
  popupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 15px',
    borderBottom: '1px solid #eee'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: '#666',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    ':hover': {
      background: '#f5f5f5',
      color: '#333'
    }
  },
  popupContent: {
    padding: '15px',
    maxHeight: '400px',
    overflowY: 'auto' as const
  }
};

export default Battlefield; 