export interface HexCoordinate {
  x: number;
  y: number;
  z: number;
}

export const createHexCoordinate = (x: number, y: number): HexCoordinate => {
  const z = -x - y;  // This ensures the coordinate sum is always 0
  return { x, y, z };
};

// Get neighbors using four patterns based on x and y
export const getNeighbors = (hex: HexCoordinate): HexCoordinate[] => {
  const isXEven = hex.x % 2 === 0;
  const isYEven = hex.y % 2 === 0;

  if (isXEven && isYEven) {
    // Pattern 1: Even X, Even Y
    return [
      createHexCoordinate(hex.x+1, hex.y),    // right
      createHexCoordinate(hex.x-1, hex.y),    // left
      createHexCoordinate(hex.x, hex.y+1),    // top left
      createHexCoordinate(hex.x+1, hex.y+1),  // top right
      createHexCoordinate(hex.x, hex.y-1),    // bottom left
      createHexCoordinate(hex.x+1, hex.y-1),  // bottom right
    ];
  } else if (isXEven && !isYEven) {
    // Pattern 2: Even X, Odd Y
    return [
      createHexCoordinate(hex.x+1, hex.y),    // right
      createHexCoordinate(hex.x-1, hex.y),    // left
      createHexCoordinate(hex.x-1, hex.y+1),    // top left
      createHexCoordinate(hex.x, hex.y+1),  // top right
      createHexCoordinate(hex.x-1, hex.y-1),    // bottom left
      createHexCoordinate(hex.x, hex.y-1),  // bottom right
    ];
  } else if (!isXEven && isYEven) {
    // Pattern 3: Odd X, Even Y
    return [
      createHexCoordinate(hex.x+1, hex.y),    // right
      createHexCoordinate(hex.x-1, hex.y),    // left
      createHexCoordinate(hex.x, hex.y+1),  // top left
      createHexCoordinate(hex.x+1, hex.y+1),    // top right
      createHexCoordinate(hex.x, hex.y-1),  // bottom left
      createHexCoordinate(hex.x+1, hex.y-1),    // bottom right
    ];
  } else {
    // Pattern 4: Odd X, Odd Y
    return [
      createHexCoordinate(hex.x+1, hex.y),    // right
      createHexCoordinate(hex.x-1, hex.y),    // left
      createHexCoordinate(hex.x-1, hex.y+1),  // top left
      createHexCoordinate(hex.x, hex.y+1),    // top right
      createHexCoordinate(hex.x-1, hex.y-1),  // bottom left
      createHexCoordinate(hex.x, hex.y-1),    // bottom right
    ];
  }
};

// Utility functions for distance and validation
export const getDistance = (a: HexCoordinate, b: HexCoordinate): number => {
  return Math.max(
    Math.abs(a.x - b.x),
    Math.abs(a.y - b.y),
    Math.abs(a.z - b.z)
  );
};

export const isValidCoordinate = (coord: HexCoordinate): boolean => {
  return coord.x + coord.y + coord.z === 0;
};

export const areCoordinatesEqual = (a: HexCoordinate, b: HexCoordinate): boolean => {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}; 