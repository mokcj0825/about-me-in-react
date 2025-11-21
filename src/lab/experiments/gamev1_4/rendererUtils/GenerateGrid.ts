import { createHexCoordinate, HexCoordinate } from "../../game-versioning/types/HexCoordinate";

export const generateGrid = (width: number, height: number) => {
	const grid: HexCoordinate[][] = [];
	for (let y = height - 1; y >= 0; y--) {
		const row: HexCoordinate[] = [];
		for (let x = 0; x < width; x++) {
			row.push(createHexCoordinate(x, y));
		}
		grid.push(row);
	}
	return grid;
};