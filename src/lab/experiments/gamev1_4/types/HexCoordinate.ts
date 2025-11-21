import mapData from '../data/map-data.json';
import {
  createHexCoordinate,
  getRawNeighbors,
  HexCoordinate
} from "../../game-versioning/types/HexCoordinate";
import { UnitDirection } from "../../game-versioning/types/UnitDirection";

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

export const getNextCoordinate = (current: HexCoordinate, direction: UnitDirection): HexCoordinate => {
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
