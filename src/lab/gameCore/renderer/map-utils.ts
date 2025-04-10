import {ScrollConfig} from "../system-config/ScrollConfig";

/**
 * Represents a 2D vector for UI component.
 * Used for positions, dimensions, and translations.
 * @interface Position
 * @property {number} x - The x-coordinate or width component
 * @property {number} y - The y-coordinate or height component
 */
export interface Position {
	x: number;
	y: number;
}

/**
 * Defines the possible scroll directions in the map.
 * @type {('left' | 'right' | 'up' | 'down')}
 */
export type ScrollDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Calculates the new position based on scroll direction and map boundaries.
 * This function implements smooth scrolling with boundary constraints.
 * 
 * @param {Position} prev - The current position vector
 * @param {ScrollDirection} direction - The direction of scroll
 * @param {Position} mapDimension - The total dimensions of the map (width, height)
 * @param {Position} viewportDimension - The dimensions of the visible viewport
 * @returns {Position} The new position vector after applying the scroll
 * 
 * @example
 * const newPos = calculateNewPosition(
 *   { x: 0, y: 0 },
 *   'right',
 *   { x: 1000, y: 1000 },
 *   { x: 800, y: 600 }
 * );
 */
export const calculateNewPosition = (
	prev: Position,
	direction: ScrollDirection,
	mapDimension: Position,
	viewportDimension: Position
): Position => {
	const newPos = { ...prev };
	
	switch (direction) {
		case 'left':
			newPos.x = Math.min(ScrollConfig.SCROLL_THRESHOLD, prev.x + ScrollConfig.SCROLL_SPEED);
			break;
		case 'right':
			newPos.x = Math.max(-(mapDimension.x - viewportDimension.x), prev.x - ScrollConfig.SCROLL_SPEED);
			break;
		case 'up':
			newPos.y = Math.min(ScrollConfig.SCROLL_THRESHOLD, prev.y + ScrollConfig.SCROLL_SPEED);
			break;
		case 'down':
			newPos.y = Math.max(-(mapDimension.y - viewportDimension.y), prev.y - ScrollConfig.SCROLL_SPEED);
			break;
	}
	
	return newPos;
};