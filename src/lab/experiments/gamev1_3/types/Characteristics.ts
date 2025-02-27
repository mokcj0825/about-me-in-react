import CHARACTERISTICS_DATA from '../data/characteristics.json';

/**
 * Valid tags that can be assigned to characteristics
 * @typedef {string} CharacteristicTag
 */
export type CharacteristicTag = 
  | 'ignore-zoc'    // Unit can ignore zones of control
  | 'heavy-armor'   // Unit has enhanced defense
  | 'flying'        // Unit ignores terrain movement costs
  | 'amphibious'    // Unit can move through water terrain
  // Add more tags as needed

/**
 * Unique identifier for characteristics
 * @typedef {string} CharacteristicId - Format: "00001", "00002", etc.
 */
export type CharacteristicId = string;

/**
 * Structure for a characteristic definition
 * @interface Characteristic
 * @property {CharacteristicId} id - Unique identifier
 * @property {string} name - Display name of the characteristic
 * @property {CharacteristicTag[]} tag - Array of tags defining behavior
 * @property {string} description - Detailed description of the effect
 */
export interface Characteristic {
  id: CharacteristicId;
  name: string;
  tag: CharacteristicTag[];
  description: string;
}

/**
 * Map of all available characteristics
 * Loaded from characteristics.json and type-asserted to match interface
 */
export const CHARACTERISTICS: Record<CharacteristicId, Characteristic> = 
  CHARACTERISTICS_DATA as Record<CharacteristicId, Characteristic>;

/**
 * Structure for a temporary characteristic buff
 * @interface Buff
 * @property {CharacteristicId} characteristicId - ID of the granted characteristic
 * @property {number} duration - Number of turns the buff lasts
 */
export interface Buff {
  characteristicId: CharacteristicId;
  duration: number;
}

/**
 * Checks if a unit has a specific characteristic tag
 * Either from innate characteristics or temporary buffs
 * 
 * @param {CharacteristicId[]} characteristics - Unit's innate characteristics
 * @param {Buff[]} buffs - Unit's active buffs
 * @param {CharacteristicTag} tag - Tag to check for
 * @returns {boolean} True if unit has the characteristic
 */
export const hasCharacteristic = (
  characteristics: CharacteristicId[], 
  buffs: Buff[], 
  tag: CharacteristicTag
): boolean => {
  // Check innate characteristics
  const hasDirectCharacteristic = characteristics.some(id => {
    const characteristic = CHARACTERISTICS[id];
    return characteristic?.tag.includes(tag);
  });

  // Check temporary buffs
  const hasBuffCharacteristic = buffs.some(buff => {
    const characteristic = CHARACTERISTICS[buff.characteristicId];
    return characteristic?.tag.includes(tag);
  });

  return hasDirectCharacteristic || hasBuffCharacteristic;
};
