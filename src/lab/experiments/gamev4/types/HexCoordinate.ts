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
    const isYEven = hex.y % 2 === 0;
    return isYEven
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
  };


export const getDistance = (a: HexCoordinate, b: HexCoordinate): number => {
  return Math.max(
    Math.abs(a.x - b.x),
    Math.abs(a.y - b.y),
    Math.abs(a.z - b.z)
  );
};

// Helper function to verify distances
export const debugDistance = (a: HexCoordinate, b: HexCoordinate): void => {
  const distance = getDistance(a, b);
  console.log(`Distance from (${a.x},${a.y}) to (${b.x},${b.y}): ${distance}`);
}

export const isValidCoordinate = (coord: HexCoordinate): boolean => {
  return coord.x + coord.y + coord.z === 0;
};

export const areCoordinatesEqual = (a: HexCoordinate, b: HexCoordinate): boolean => {
  return a.x === b.x && a.y === b.y && a.z === b.z;
};

export const getZoneOfControl = (unitPosition: HexCoordinate): HexCoordinate[] => {
  const isYEven = unitPosition.y % 2 === 0;
  return isYEven
    ? [
        createHexCoordinate(unitPosition.x + 1, unitPosition.y),     // right
        createHexCoordinate(unitPosition.x - 1, unitPosition.y),     // left
        createHexCoordinate(unitPosition.x, unitPosition.y + 1),     // top left
        createHexCoordinate(unitPosition.x + 1, unitPosition.y + 1), // top right
        createHexCoordinate(unitPosition.x, unitPosition.y - 1),     // bottom left
        createHexCoordinate(unitPosition.x + 1, unitPosition.y - 1), // bottom right
      ]
    : [
        createHexCoordinate(unitPosition.x + 1, unitPosition.y),     // right
        createHexCoordinate(unitPosition.x - 1, unitPosition.y),     // left
        createHexCoordinate(unitPosition.x - 1, unitPosition.y + 1), // top left
        createHexCoordinate(unitPosition.x, unitPosition.y + 1),     // top right
        createHexCoordinate(unitPosition.x - 1, unitPosition.y - 1), // bottom left
        createHexCoordinate(unitPosition.x, unitPosition.y - 1),     // bottom right
      ];
}; 