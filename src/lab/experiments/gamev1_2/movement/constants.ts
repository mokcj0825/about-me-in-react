import { MovementCost } from './types';

/**
 * Default movement costs for each terrain type
 * 999 represents impassable terrain for that movement type
 * 
 * Movement Types:
 * - foot: Standard ground movement
 * - ooze: Slime/liquid movement
 * - float: Hovering movement
 * - flying: Aerial movement
 */
export const DEFAULT_MOVEMENT_COSTS: MovementCost = {
    'plain': { foot: 1, ooze: 1, float: 1, flying: 1 },      // Basic terrain
    'road': { foot: 1, ooze: 2, float: 1, flying: 1 },       // Improved for foot units
    'forest': { foot: 2, ooze: 2, float: 1, flying: 1 },     // Dense vegetation
    'cliff': { foot: 3, ooze: 999, float: 2, flying: 1 },    // Vertical terrain
    'mountain': { foot: 3, ooze: 999, float: 2, flying: 1 }, // High elevation
    'wasteland': { foot: 2, ooze: 1, float: 1, flying: 1 },  // Rough terrain
    'ruins': { foot: 2, ooze: 2, float: 1, flying: 1 },      // Broken structures
    'river': { foot: 999, ooze: 1, float: 1, flying: 1 },    // Water terrain
    'swamp': { foot: 2, ooze: 1, float: 1, flying: 1 },      // Wet terrain
    'sea': { foot: 999, ooze: 2, float: 1, flying: 1 },      // Deep water
}; 