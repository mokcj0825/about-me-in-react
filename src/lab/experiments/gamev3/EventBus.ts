import mitt from 'mitt';
import { UnitSelectedEvent, UnitHoveredEvent } from './types/EventTypes';

type Events = {
  'unit-selected': UnitSelectedEvent;
  'unit-hovered': UnitHoveredEvent;
  'unit-moved': { 
    unitId: string; 
    from: { x: number; y: number; z: number }; 
    to: { x: number; y: number; z: number } 
  };
  'turn-ended': { 
    fraction: string 
  };
  'terrain-changed': { 
    position: { x: number; y: number; z: number }; 
    type: string 
  };
};

export const eventBus = mitt<Events>();