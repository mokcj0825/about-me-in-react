import { getDistance, getRawNeighbors, HexCoordinate } from "../../game-versioning/types/HexCoordinate";
import mapData from '../data/map-data.json';

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