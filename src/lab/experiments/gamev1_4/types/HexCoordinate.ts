import mapData from '../data/map-data.json';
import { DirectionData } from './DirectionData';
import { getDistance, getRawNeighbors, HexCoordinate } from "../../game-versioning/types/HexCoordinate";

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
  const neighbors = getRawNeighbors(hex);

  return neighbors.filter(coord => 
    coord.x >= 0 && coord.x < mapData.width && 
    coord.y >= 0 && coord.y < mapData.height
  );
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