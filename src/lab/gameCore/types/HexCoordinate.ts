import {DirectionData} from "./DirectionData";

export interface HexCoordinate {
	x: number;
	y: number;
	z: number;
}

export const createHexCoordinate = (x: number, y: number): HexCoordinate => ({
	x,
	y,
	z: -x - y
});

export const getNeighbors = (hex: HexCoordinate, width: number, height: number): HexCoordinate[] => {
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
		coord.x >= 0 && coord.x < width &&
		coord.y >= 0 && coord.y < height
	);
};

export const getDistance = (a: HexCoordinate, b: HexCoordinate): number => {
	return Math.max(
		Math.abs(a.x - b.x),
		Math.abs(a.y - b.y),
		Math.abs(a.z - b.z)
	);
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