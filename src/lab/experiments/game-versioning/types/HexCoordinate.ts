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
  z: number;
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

export const getRawNeighbors = (hex: HexCoordinate): HexCoordinate[] => {
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
}

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