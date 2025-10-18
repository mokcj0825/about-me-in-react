import { getRawNeighbors, HexCoordinate } from "../../game-versioning/types/HexCoordinate";

export const createHexCoordinate = (x: number, y: number): HexCoordinate => {
  const z = -x - y;  // This ensures the coordinate sum is always 0
  return { x, y, z };
};

// Get neighbors using four patterns based on x and y
export const getNeighbors = (hex: HexCoordinate): HexCoordinate[] => {
  return getRawNeighbors(hex);
};


export const getZoneOfControl = (unitPosition: HexCoordinate): HexCoordinate[] => {
  return getNeighbors(unitPosition);
}; 