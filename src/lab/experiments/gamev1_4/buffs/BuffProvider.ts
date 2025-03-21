import {BuffEffect} from "./BuffEffect";

/**
 * Provider interface for creating buff effects
 *
 * Buff providers are registered with the BuffRegistry and are responsible for:
 * 1. Providing a unique identifier for the buff type
 * 2. Creating new instances of buff effects when requested
 *
 * Usage:
 * ```typescript
 * class MyBuff implements BuffProvider {
 *   id = 'myBuff';
 *   getEffect(): BuffEffect {
 *     return {
 *       id: this.id,
 *       duration: 3,
 *       modifyMovement: (unit, base) => base + 1
 *     };
 *   }
 * }
 * ```
 */
export interface BuffProvider {
	/** Unique identifier for this type of buff */
	id: string;

	/**
	 * Creates a new instance of the buff effect
	 * Called when the buff needs to be applied to a unit
	 */
	getEffect(): BuffEffect;
}