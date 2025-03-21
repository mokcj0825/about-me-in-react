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

  // Handle turn state changes and announcements
  useEffect(() => {
    console.log('Turn state changed:', turnState);
    
    const message = getAnnouncementMessage(turnState);
    
    if (turnState.phase === 'ally' || turnState.phase === 'enemy') {
      setIsAITurnActive(true);
      onAnnouncementChange?.(message);
      onAITurnStart?.();
      
      setTimeout(() => {
        if (turnState.phase === 'enemy' && turnState.cycle === 'day') {
          onUnitsUpdate(units => {
            let updatedUnits = handlePhaseEvent(units, 'onDayEnd');
            return handlePhaseEvent(updatedUnits, 'onNightStart');
          });
        }
        onAnnouncementChange?.(null);
        setIsAITurnActive(false);
        onAITurnEnd?.();
        setTurnState(prevTurn => advanceTurn(prevTurn));
      }, 1000);
    } else if (message && turnState.phase === 'player') {
      onAnnouncementChange?.(message);
      setTimeout(() => onAnnouncementChange?.(null), 1100);
    }
  }, [turnState]);

  const handleEndTurn = () => {
    if (turnState.cycle === 'day') {
      setTurnState(prevTurn => advanceTurn(prevTurn));
      onUnitsUpdate(prevUnits => handleFactionTurn(prevUnits, 'player'));
    } else {
      // Night ends, day starts - immediate transition
      console.log('Transitioning: Night -> Day');
      onUnitsUpdate(units => {
        let updatedUnits = handlePhaseEvent(units, 'onNightEnd');
        return handlePhaseEvent(updatedUnits, 'onDayStart');
      });
      setTurnState(prevTurn => advanceTurn(prevTurn));
      onUnitsUpdate(prevUnits => 
        prevUnits.map(unit => ({ ...unit, hasMoved: false }))
      );
    }
  };

  return {
    turnState,
    isAITurnActive,
    handleEndTurn,
    setTurnState,
  };
}; 