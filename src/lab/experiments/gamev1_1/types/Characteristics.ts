export type CharacteristicTag = 
  | 'ignore-zoc'
  | 'heavy-armor'
  | 'flying'
  // Add more tags as needed

export type CharacteristicId = string;  // For IDs like "00001"

export interface Characteristic {
  id: CharacteristicId;
  name: string;
  tag: string;
  description: string;
}

export const CHARACTERISTICS: Record<CharacteristicId, Characteristic> = {
  '00001': {
    id: '00001',
    name: '神速',
    tag: 'ignore-zoc',
    description: '这个单位移动时可以无视ZOC'
  },
  '00002': {
    id: '00002',
    name: '重装',
    tag: 'heavy-armor',
    description: '这个单位具有更高的防御力'
  },
  '00003': {
    id: '00003',
    name: '飞行',
    tag: 'flying',
    description: '这个单位可以无视地形移动'
  }
  // Add more characteristics as needed
};

export interface Buff {
  characteristicId: CharacteristicId;
  duration: number;
}

// Helper function to check if unit has a characteristic (either innate or from buff)
export const hasCharacteristic = (
  characteristics: CharacteristicId[], 
  buffs: Buff[], 
  tag: CharacteristicTag
): boolean => {
  // Remove debug logs as they're no longer needed
  
  // Check if any of the unit's characteristics match the tag
  const hasDirectCharacteristic = characteristics.some(id => {
    const characteristic = CHARACTERISTICS[id];
    return characteristic?.tag === tag;
  });

  // Check if any of the unit's buffs provide the tag
  const hasBuffCharacteristic = buffs.some(buff => {
    const characteristic = CHARACTERISTICS[buff.characteristicId];
    return characteristic?.tag === tag;
  });

  return hasDirectCharacteristic || hasBuffCharacteristic;
};
