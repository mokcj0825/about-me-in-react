import type { TerrainType } from '../movement/types'

/**
 * Maps terrain types to their corresponding SVG image paths
 * Used for visual representation of terrain in the hex grid
 * 
 * @constant {Record<TerrainType, string>}
 */
const terrainSvgMap: Record<TerrainType, string> = {
  plain: '/map-terrain/plain.svg',      // Basic traversable terrain
  road: '/map-terrain/road.svg',        // Improved movement path
  forest: '/map-terrain/forest.svg',    // Dense vegetation cover
  cliff: '/map-terrain/cliff.svg',      // Vertical obstacle
  mountain: '/map-terrain/mountain.svg', // Elevated terrain
  wasteland: '/map-terrain/wasteland.svg', // Damaged terrain
  ruins: '/map-terrain/ruins.svg',      // Destroyed structures
  river: '/map-terrain/river.svg',      // Flowing water
  swamp: '/map-terrain/swamp.svg',      // Marshy terrain
  sea: '/map-terrain/sea.svg'           // Deep water
}

/**
 * Gets the SVG path for a specific terrain type
 * @param {TerrainType} terrain - Type of terrain to get SVG for
 * @returns {string} Path to the terrain's SVG image
 */
export const getTerrainSvgPath = (terrain: TerrainType): string => {
  return terrainSvgMap[terrain]
} 