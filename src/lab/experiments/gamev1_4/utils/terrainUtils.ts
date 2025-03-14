import type { TerrainType } from '../movement/types';

/**
 * Mapping of terrain types to their display labels
 */
export const TERRAIN_LABELS: Record<TerrainType, string> = {
  'plain': '平地',
  'mountain': '山地',
  'forest': '森林',
  'sea': '海洋',
  'river': '河流',
  'cliff': '悬崖',
  'road': '道路',
  'wasteland': '荒地',
  'ruins': '遗迹',
  'swamp': '沼泽'
};

/**
 * Get description for a terrain type
 */
export const getTerrainDescription = (type: TerrainType): string => {
    switch (type) {
      case 'plain':
        return '你没法期待获得多少掩护，敌人也是。';
      case 'mountain':
        return '你可以占据一个比较险要的地方，至少可以居高临下。';
      case 'forest':
        return '适合埋伏的地方，在雾战时位于此的飞行单位无法隐蔽。';
      case 'sea':
        return '只有水上单位和飞行单位可以移动。';
      case 'river':
        return '步行单位难以跨越的天险。';
      case 'cliff':
        return '险峻的地形，可以获得更大的战斗优势。';
      case 'road':
        return '文明的血管，可以快速移动。';
      case 'wasteland':
        return '荒芜人烟的区域，难以移动，但是视野还算广阔。';
      case 'ruins':
        return '不知名的废墟，可以提供一定的掩护，在雾战时位于此的飞行单位无法隐蔽。';
      case 'swamp':
        return '糟糕的区域，对大部分生物都不友好。';
      default:
        return '未知地形。';
    }
  };