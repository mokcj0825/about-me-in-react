import { DialogEvent } from "../utils/DialogEvent";
import { EventCommand } from "../EventCommand";

export enum CharacterPosition {
  LEFT = 'LEFT',
  MIDDLE = 'MIDDLE',
  RIGHT = 'RIGHT'
}

export interface ShowCharacterEvent extends DialogEvent {
  eventCommand: EventCommand.SHOW_CHARACTER;
  position: CharacterPosition;
  spriteUrl?: string;
  res?: string;
}

/**
 * Type guard to check if event is a valid show character event
 */
export const isShowCharacterEvent = (event: DialogEvent): event is ShowCharacterEvent => {
  return event.eventCommand === EventCommand.SHOW_CHARACTER && 
         'position' in event;
};

/**
 * Extract character sprite information from event
 * Returns position and sprite name if valid, null otherwise
 */
export const getCharacterSprite = (event: DialogEvent): { position: CharacterPosition, sprite: string } | null => {
  if (!isShowCharacterEvent(event)) {
    return null;
  }
  
  // Now TypeScript knows this is a ShowCharacterEvent
  const { position } = event;
  
  if (event.spriteUrl) {
    return { position, sprite: event.spriteUrl };
  } 
  
  if (event.res) {
    return { position, sprite: event.res };
  }
  
  return null;
};