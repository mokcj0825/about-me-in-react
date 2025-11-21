import { getRawNeighbors, HexCoordinate } from "../../experiments/game-versioning/types/HexCoordinate";
import { UnitDirection } from "../../experiments/game-versioning/types/UnitDirection";

export const createHexCoordinate = (x: number, y: number): HexCoordinate => ({
	x,
	y,
	z: -x - y
});

export const getNeighbors = (hex: HexCoordinate, width: number, height: number): HexCoordinate[] => {
	const neighbors = getRawNeighbors(hex);

	return neighbors.filter(coord =>
		coord.x >= 0 && coord.x < width &&
		coord.y >= 0 && coord.y < height
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