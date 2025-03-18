import { HexCoordinate, getNextCoordinate } from '../types/HexCoordinate';
import {ALL_DIRECTIONS} from '../types/DirectionData';
import mapData from '../data/map-data.json';

export class SelectionCalculator {
	private isValidCoordinate(coord: HexCoordinate): boolean {
		return coord.x >= 0 && coord.x < mapData.width &&
			coord.y >= 0 && coord.y < mapData.height;
	}

	getAreaSelection(origin: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
		console.log('Calculating area selection from', origin, 'range:', minRange, '-', maxRange);
		const result: HexCoordinate[] = [];

		// Start with origin and expand outward
		let currentLayer = [origin];
		let currentDistance = 0;

		while (currentDistance <= maxRange) {
			const nextLayer: HexCoordinate[] = [];

			currentLayer.forEach(hex => {
				if (currentDistance >= minRange && this.isValidCoordinate(hex)) {
					result.push(hex);
				}

				if (currentDistance < maxRange) {
					ALL_DIRECTIONS.forEach(direction => {
						const neighbor = getNextCoordinate(hex, direction);
						if (!result.some(r => r.x === neighbor.x && r.y === neighbor.y)) {
							nextLayer.push(neighbor);
						}
					});
				}
			});

			currentLayer = nextLayer;
			currentDistance++;
		}

		return result;
	}

	getLineSelection(origin: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
		console.log('Calculating line selection from', origin, 'range:', minRange, '-', maxRange);
		const result: HexCoordinate[] = [];

		ALL_DIRECTIONS.forEach(direction => {
			let current = origin;
			let distance = 0;

			while (distance <= maxRange) {
				if (distance >= minRange && this.isValidCoordinate(current)) {
					result.push(current);
				}

				current = getNextCoordinate(current, direction);
				distance++;
			}
		});

		return result;
	}

	getFanSelection(origin: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
		console.log('Calculating fan selection from', origin, 'range:', minRange, '-', maxRange);
		const result: HexCoordinate[] = [];

		// Get all hexes within range
		const allHexes = this.getAreaSelection(origin, minRange, maxRange);

		ALL_DIRECTIONS.forEach(direction => {
			const fanCenter = getNextCoordinate(origin, direction);

			// Add hexes that fall within the 120-degree arc
			allHexes.forEach(hex => {
				const relativeX = hex.x - origin.x;
				const relativeY = hex.y - origin.y;
				const centerX = fanCenter.x - origin.x;
				const centerY = fanCenter.y - origin.y;

				// Use dot product to check if hex is within 120-degree arc
				const dot = centerX * relativeX + centerY * relativeY;
				const lenSq = (centerX * centerX + centerY * centerY) *
					(relativeX * relativeX + relativeY * relativeY);

				if (dot * dot >= lenSq * 0.25) { // cos(120) = -0.5
					result.push(hex);
				}
			});
		});

		return result;
	}

	getRoundSelection(origin: HexCoordinate, minRange: number, maxRange: number): HexCoordinate[] {
		console.log('Calculating round selection from', origin, 'range:', minRange, '-', maxRange);
		return this.getAreaSelection(origin, minRange, maxRange);
	}
}