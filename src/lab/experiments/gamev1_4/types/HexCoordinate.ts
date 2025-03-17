import mapData from '../data/map-data.json';
import { DirectionData } from './DirectionData';

/**
 * Represents a position in the hex grid using cube coordinates
 * @interface HexCoordinate
 * @property {number} x - X coordinate (q in cube coordinate system)
 * @property {number} y - Y coordinate (r in cube coordinate system)
 * @property {number} z - Z coordinate (calculated as -x-y to ensure sum is 0)
 */
export interface HexCoordinate {
  x: number;
  y: number;
  z: number;  // Keeping z in interface but calculated internally
}

/**
 * Creates a new hex coordinate with calculated z value
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {HexCoordinate} New hex coordinate with calculated z
 */
export const createHexCoordinate = (x: number, y: number): HexCoordinate => {
  const z = -x - y;  // This ensures the coordinate sum is always 0
  return { x, y, z };
};

/**
 * Gets all neighboring hex coordinates
 * Uses even-q vertical layout offset coordinates
 * @param {HexCoordinate} hex - Center hex to find neighbors for
 * @returns {HexCoordinate[]} Array of valid neighboring coordinates
 */
export const getNeighbors = (hex: HexCoordinate): HexCoordinate[] => {
  const isYEven = hex.y % 2 === 0;
  const neighbors = isYEven
    ? [
        createHexCoordinate(hex.x + 1, hex.y),  // right
        createHexCoordinate(hex.x - 1, hex.y),  // left
        createHexCoordinate(hex.x, hex.y + 1),  // top left
        createHexCoordinate(hex.x + 1, hex.y + 1),  // top right
        createHexCoordinate(hex.x, hex.y - 1),  // bottom left
        createHexCoordinate(hex.x + 1, hex.y - 1),  // bottom right
      ]
    : [
        createHexCoordinate(hex.x + 1, hex.y),  // right
        createHexCoordinate(hex.x - 1, hex.y),  // left
        createHexCoordinate(hex.x - 1, hex.y + 1),  // top left
        createHexCoordinate(hex.x, hex.y + 1),  // top right
        createHexCoordinate(hex.x - 1, hex.y - 1),  // bottom left
        createHexCoordinate(hex.x, hex.y - 1),  // bottom right
      ];

  return neighbors.filter(coord => 
    coord.x >= 0 && coord.x < mapData.width && 
    coord.y >= 0 && coord.y < mapData.height
  );
};

/**
 * Calculates the distance between two hex coordinates
 * Uses cube coordinate distance formula
 * @param {HexCoordinate} a - First coordinate
 * @param {HexCoordinate} b - Second coordinate
 * @returns {number} Distance in hex steps
 */
export const getDistance = (a: HexCoordinate, b: HexCoordinate): number => {
  return Math.max(
    Math.abs(a.x - b.x),
    Math.abs(a.y - b.y),
    Math.abs(a.z - b.z)
  );
};

/**
 * Debug helper to log distance between two coordinates
 * @param {HexCoordinate} a - First coordinate
 * @param {HexCoordinate} b - Second coordinate
 */
export const debugDistance = (a: HexCoordinate, b: HexCoordinate): void => {
  const distance = getDistance(a, b);
  console.log(`Distance from (${a.x},${a.y}) to (${b.x},${b.y}): ${distance}`);
}

/**
 * Validates a hex coordinate's z value
 * @param {HexCoordinate} coord - Coordinate to validate
 * @returns {boolean} True if x + y + z = 0
 */
export const isValidCoordinate = (coord: HexCoordinate): boolean => {
  return coord.x + coord.y + coord.z === 0;
};

/**
 * Checks if two coordinates are equal
 * @param {HexCoordinate} a - First coordinate
 * @param {HexCoordinate} b - Second coordinate
 * @returns {boolean} True if coordinates are equal
 */
export const areCoordinatesEqual = (a: HexCoordinate, b: HexCoordinate): boolean => {
  return a.x === b.x && a.y === b.y && a.z === b.z;
};

/**
 * Gets all hexes in a unit's zone of control
 * Currently returns immediate neighbors
 * @param {HexCoordinate} unitPosition - Unit's position
 * @returns {HexCoordinate[]} Array of controlled hex coordinates
 */
export const getZoneOfControl = (unitPosition: HexCoordinate): HexCoordinate[] => {
  return getNeighbors(unitPosition);
}; 

export const getNextCoordinate = (current: HexCoordinate, direction: DirectionData): HexCoordinate => {
  const isYEven = current.y % 2 === 0;
  switch (direction) {
    case 'right':
      return createHexCoordinate(current.x + 1, current.y);
    case 'left':
      return createHexCoordinate(current.x - 1, current.y);
    case 'top-left':
      return createHexCoordinate(current.x + (isYEven ? 0 : -1), current.y + 1);
    case 'top-right':
      return createHexCoordinate(current.x + (isYEven ? 1 : 0), current.y + 1);
    case 'bottom-left':
      return createHexCoordinate(current.x + (isYEven ? 0 : -1), current.y - 1);
    case 'bottom-right':
      return createHexCoordinate(current.x + (isYEven ? 1 : 0), current.y - 1);
    default:
      return current;
  }
};

export const DIRECTIONS = ['right', 'left', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const;
export type Direction = typeof DIRECTIONS[number];