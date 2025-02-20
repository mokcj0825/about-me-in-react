import type { TerrainType } from '../movement/types'

// Create a mapping of terrain types to their SVG paths
const terrainSvgMap: Record<TerrainType, string> = {
  plain: '/src/assets/map-terrain/plain.svg',
  road: '/src/assets/map-terrain/road.svg',
  forest: '/src/assets/map-terrain/forest.svg',
  cliff: '/src/assets/map-terrain/cliff.svg',
  mountain: '/src/assets/map-terrain/mountain.svg',
  wasteland: '/src/assets/map-terrain/wasteland.svg',
  ruins: '/src/assets/map-terrain/ruins.svg',
  river: '/src/assets/map-terrain/river.svg',
  swamp: '/src/assets/map-terrain/swamp.svg',
  sea: '/src/assets/map-terrain/sea.svg'
}

export const getTerrainSvgPath = (terrain: TerrainType): string => {
  return terrainSvgMap[terrain]
} 