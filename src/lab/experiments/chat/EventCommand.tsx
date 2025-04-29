export enum EventCommand {
	SHOW_MESSAGE = 'SHOW_MESSAGE',
	CLEAR_MESSAGE = 'CLEAR_MESSAGE',
	WAIT = 'WAIT',
	REQUEST_SELECTION = 'REQUEST_SELECTION',
	SET_BACKGROUND = 'SET_BACKGROUND',
	REMOVE_BACKGROUND = 'REMOVE_BACKGROUND',
	SHOW_CHARACTER = 'SHOW_CHARACTER',
	HIDE_CHARACTER = 'HIDE_CHARACTER'
}

export enum CharacterPosition {
	LEFT = 'LEFT',
	MIDDLE = 'MIDDLE',
	RIGHT = 'RIGHT'
}

export interface ShowCharacterEvent {
	eventCommand: EventCommand.SHOW_CHARACTER;
	position: CharacterPosition;
	spriteUrl: string;
}

export interface HideCharacterEvent {
	eventCommand: EventCommand.HIDE_CHARACTER;
	position: CharacterPosition;
}