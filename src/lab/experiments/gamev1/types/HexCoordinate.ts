import {
  createHexCoordinate,
  getRawNeighbors,
  HexCoordinate
} from "../../game-versioning/types/HexCoordinate";

// Get neighbors using four patterns based on x and y
export const getNeighbors = (hex: HexCoordinate): HexCoordinate[] => {
    return getRawNeighbors(hex);
  };


export const getZoneOfControl = (unitPosition: HexCoordinate): HexCoordinate[] => {
  return getNeighbors(unitPosition);
}; 