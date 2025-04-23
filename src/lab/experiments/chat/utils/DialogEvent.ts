export enum SpritePosition {
	LEFT = 'LEFT',
	MIDDLE = 'MIDDLE',
	RIGHT = 'RIGHT'
}

export interface DialogEvent {
	eventCommand: string;
	unitRes: string | null;
	position: SpritePosition;
	message: string;
}