import plainSvg from '/src/assets/map-terrain/plain.svg'
import roadSvg from '/src/assets/map-terrain/road.svg'
import forestSvg from '/src/assets/map-terrain/forest.svg'
import cliffSvg from '/src/assets/map-terrain/cliff.svg'
import mountainSvg from '/src/assets/map-terrain/mountain.svg'
import wastelandSvg from '/src/assets/map-terrain/wasteland.svg'
import ruinsSvg from '/src/assets/map-terrain/ruins.svg'
import riverSvg from '/src/assets/map-terrain/river.svg'
import swampSvg from '/src/assets/map-terrain/swamp.svg'
import seaSvg from '/src/assets/map-terrain/sea.svg'
import type { TerrainType } from '../movement/types'

// Create a mapping of terrain types to their SVG paths
const terrainSvgMap: Record<TerrainType, string> = {
  plain: plainSvg,
  road: roadSvg,
  forest: forestSvg,
  cliff: cliffSvg,
  mountain: mountainSvg,
  wasteland: wastelandSvg,
  ruins: ruinsSvg,
  river: riverSvg,
  swamp: swampSvg,
  sea: seaSvg
}

export const getTerrainSvgPath = (terrain: TerrainType): string => {
  return terrainSvgMap[terrain]
} 