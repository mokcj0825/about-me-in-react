import { useEffect, useState } from 'react';
import { eventBus } from "./EventBus";
import { UnitSelectedEvent } from "./types/EventTypes";
import { characteristicRegistry } from './characteristics/registry/CharacteristicRegistry';

export type TurnPhase = 'player' | 'ally' | 'enemy';
export type DayNightCycle = 'day' | 'night';
export type PhaseEvent = 'onDayStart' | 'onDayEnd' | 'onNightStart' | 'onNightEnd';

export interface TurnState {
  number: number;
  cycle: DayNightCycle;
  phase: TurnPhase;
}

export const TurnManager = () => {
  const [turnState, setTurnState] = useState<TurnState>({
    number: 1,
    cycle: 'day',
    phase: 'player'
  });

  // Add new useEffect for initial day start
  useEffect(() => {
    console.log('Initial game start - emitting day start');
    eventBus.emit('cycle-changed', { type: 'onDayStart' });
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const handleUnitSelected = ({ unitId, position }: UnitSelectedEvent) => {
      console.log(`Validating turn for unit ${unitId} at (${position.x}, ${position.y}, ${position.z})`);
    };

    const handleTurnEnded = ({ fraction }: { fraction: string }) => {
      console.log('Turn ended for fraction:', fraction);
      
      setTurnState(prevState => {
        const nextState = { ...prevState };

        // Update phase
        switch (prevState.phase) {
          case 'player':
            nextState.phase = 'ally';
            break;
          case 'ally':
            nextState.phase = 'enemy';
            break;
          case 'enemy':
            // End of all phases, switch cycle
            if (prevState.cycle === 'day') {
              nextState.cycle = 'night';
              nextState.phase = 'player';
              // Emit night start event
              eventBus.emit('phase-change', { type: 'onNightStart' });
            } else {
              // Night ends, new day starts
              nextState.number += 1;
              nextState.cycle = 'day';
              nextState.phase = 'player';
              // Emit day start event
              eventBus.emit('phase-change', { type: 'onDayStart' });
            }
            break;
        }

        console.log('Turn state updated:', nextState);
        return nextState;
      });
    };

    const handlePhaseChange = ({ type }: { type: 'onDayStart' | 'onNightStart' }) => {
      console.log('Phase change:', type);
      eventBus.emit('cycle-changed', { type });
    };

    eventBus.on('unit-selected', handleUnitSelected);
    eventBus.on('turn-ended', handleTurnEnded);
    eventBus.on('phase-change', handlePhaseChange);

    return () => {
      eventBus.off('unit-selected', handleUnitSelected);
      eventBus.off('turn-ended', handleTurnEnded);
      eventBus.off('phase-change', handlePhaseChange);
    };
  }, []);

  return null;
};
