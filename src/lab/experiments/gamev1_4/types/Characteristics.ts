import CHARACTERISTICS_DATA from '../data/characteristics.json';
import { Buff } from './UnitData';

/**
 * Valid tags that can be assigned to characteristics
 * @typedef {string} CharacteristicTag
 */
export type CharacteristicTag = 
  | 'ignore-zoc'    // Unit can ignore zones of control
  | 'heavy-armor'   // Unit has enhanced defense
  | 'flying'        // Unit ignores terrain movement costs
  | 'amphibious'    // Unit can move through water terrain
  | 'dayWalker'     // Unit gains extra movement during the day
  | 'nightPhobic'   // Unit loses movement during the night
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
 * Checks if a unit has a specific characteristic tag
 * Either from innate characteristics or temporary buffs
 * 
 * @param {CharacteristicId[]} characteristics - Unit's innate characteristics
 * @param {Buff[]} buffs - Unit's active buffs
 * @param {CharacteristicTag} tag - Tag to check for
 * @returns {boolean} True if unit has the characteristic
 */
export function hasCharacteristic(
  characteristics: string[],
  buffs: Buff[],
  characteristicId: string
): boolean {
  return characteristics.includes(characteristicId) || 
         buffs.some(buff => buff.id === characteristicId);
}
