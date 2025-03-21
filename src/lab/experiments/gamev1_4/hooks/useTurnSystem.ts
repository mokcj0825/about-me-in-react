import { useState, useEffect } from 'react';
import { UnitData } from '../types/UnitData';
import { TurnState } from '../types/TurnState';
import { advanceTurn, DayNightCycle, handleFactionTurn, handlePhaseEvent, TurnPhase } from '../systems/TurnSystem';
import { getAnnouncementMessage } from '../components/TurnAnnouncement';
import stageData from '../data/stage-data.json';
import { DEBUGGING_MODE } from '../config';

interface UseTurnSystemProps {
  onUnitsUpdate: (updater: (units: UnitData[]) => UnitData[]) => void;
  onAITurnStart?: () => void;
  onAITurnEnd?: () => void;
  onAnnouncementChange?: (message: string | null) => void;
}

interface UseTurnSystemReturn {
  // State
  turnState: TurnState;
  isAITurnActive: boolean;
  
  // Actions
  handleEndTurn: () => void;
  
  // Setters
  setTurnState: React.Dispatch<React.SetStateAction<TurnState>>;
}

/**
 * Custom hook for managing turn state, phase changes, and day/night cycle
 */
export const useTurnSystem = ({
  onUnitsUpdate,
  onAITurnStart,
  onAITurnEnd,
  onAnnouncementChange
}: UseTurnSystemProps): UseTurnSystemReturn => {
  const [turnState, setTurnState] = useState<TurnState>({
    number: stageData.initialState.turnNumber,
    cycle: stageData.initialState.startCycle as DayNightCycle,
    phase: stageData.initialState.startPhase as TurnPhase
  });
  
  const [isAITurnActive, setIsAITurnActive] = useState(false);

  const handleEndTurn = () => {
    if (turnState.cycle === 'day') {
      // Reset player movement
      onUnitsUpdate(prevUnits => handleFactionTurn(prevUnits, 'player'));
      
      // Start ally phase
      setTurnState(prevTurn => ({ ...prevTurn, phase: 'ally' }));
    } else {
      // Night ends, transition to day
      console.log('Transitioning: Night -> Day');
      onUnitsUpdate(units => {
        let updatedUnits = handlePhaseEvent(units, 'onNightEnd');
        updatedUnits = handlePhaseEvent(updatedUnits, 'onDayStart');
        return handleFactionTurn(updatedUnits, 'player'); // Reset player movement for new day
      });
      setTurnState(prevTurn => ({
        number: prevTurn.number + 1,
        cycle: 'day',
        phase: 'player'
      }));
    }
  };

  // Handle turn state changes and announcements
  useEffect(() => {
    console.log('Turn state changed:', turnState);
    
    const message = getAnnouncementMessage(turnState);
    
    if (turnState.phase === 'ally' || turnState.phase === 'enemy') {
      setIsAITurnActive(true);
      onAnnouncementChange?.(message);
      onAITurnStart?.();
      
      console.log(`${turnState.phase === 'ally' ? 'Allies' : 'Enemy'} thinking...`);
      
      // Simulate AI turn - this will be replaced with actual AI logic
      setTimeout(() => {
        // Reset movement for AI faction
        onUnitsUpdate(units => handleFactionTurn(units, turnState.phase));
        
        console.log(`${turnState.phase === 'ally' ? 'Allies' : 'Enemy'} finished their turn`);
        
        onAnnouncementChange?.(null);
        setIsAITurnActive(false);
        onAITurnEnd?.();
        
        // If this is the enemy phase and we're in day cycle, handle night transition
        if (turnState.phase === 'enemy' && turnState.cycle === 'day') {
          console.log('Transitioning: Day -> Night');
          onUnitsUpdate(units => {
            let updatedUnits = handlePhaseEvent(units, 'onDayEnd');
            updatedUnits = handlePhaseEvent(updatedUnits, 'onNightStart');
            return handleFactionTurn(updatedUnits, 'player'); // Reset player movement for night turn
          });
          // Transition to night player phase
          setTurnState(prevTurn => ({
            ...prevTurn,
            cycle: 'night',
            phase: 'player'
          }));
        } else if (turnState.phase === 'ally') {
          // After ally phase, start enemy phase
          setTurnState(prevTurn => ({ ...prevTurn, phase: 'enemy' }));
        }
      }, 1000);
    } else if (message && turnState.phase === 'player') {
      console.log('Player phase started');
      onAnnouncementChange?.(message);
      setTimeout(() => onAnnouncementChange?.(null), 1100);
    }
  }, [turnState]);

  return {
    turnState,
    isAITurnActive,
    handleEndTurn,
    setTurnState,
  };
}; 