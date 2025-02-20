import type { TerrainType } from '../movement/types'

const terrainSvgMap: Record<TerrainType, string> = {
  plain: '/map-terrain/plain.svg',
  road: '/map-terrain/road.svg',
  forest: '/map-terrain/forest.svg',
  cliff: '/map-terrain/cliff.svg',
  mountain: '/map-terrain/mountain.svg',
  wasteland: '/map-terrain/wasteland.svg',
  ruins: '/map-terrain/ruins.svg',
  river: '/map-terrain/river.svg',
  swamp: '/map-terrain/swamp.svg',
  sea: '/map-terrain/sea.svg'
}

export const getTerrainSvgPath = (terrain: TerrainType): string => {
  return terrainSvgMap[terrain]
} 