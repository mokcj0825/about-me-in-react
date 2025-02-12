import mitt from 'mitt';

type Events = {
  'unit-hovered': { unitId: string };
  'unit-selected': { unitId: string };
  'unit-moved': { unitId: string; from: { q: number; r: number }; to: { q: number; r: number } };
  'turn-ended': { fraction: string };
  'terrain-changed': { q: number; r: number; type: string };
};

export const eventBus = mitt<Events>();