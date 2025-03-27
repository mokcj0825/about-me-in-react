import { HexCoordinate } from "../types/HexCoordinate";
import { ShapeConfig } from "./ShapeCalculator";
import { RoundSelection } from "./selection/RoundSelection";
import { LineSelection } from "./selection/LineSelection";
import { FanSelection } from "./selection/FanSelection";

/**
 * Calculator for weapon selection areas
 */
export class SelectionCalculator {
	/**
	 * Get all coordinates that can be selected for a weapon
	 * @param unitPosition - Position of the unit using the weapon
	 * @param config - Weapon selection configuration
	 */
	static getSelectionArea(
		unitPosition: HexCoordinate,
		config: ShapeConfig
	): HexCoordinate[] {
		switch (config.type) {
			case 'round':
				return RoundSelection.getSelectionArea(unitPosition, config.minSelectRange, config.maxSelectRange);
			case 'line':
				return LineSelection.getSelectionArea(unitPosition, config.minSelectRange, config.maxSelectRange);
			case 'fan':
				return FanSelection.getSelectionArea(unitPosition, config.minSelectRange, config.maxSelectRange);
			default:
				return [];
		}
	}
}