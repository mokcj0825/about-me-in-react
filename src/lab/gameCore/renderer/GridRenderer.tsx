import {TerrainType} from "../types/TerrainType";
import {HexCell} from "../component/HexCell/HexCell";
import {HexCoordinate} from "../../experiments/game-versioning/types/HexCoordinate";
import React from "react";

interface Props {
	terrain: TerrainType,
	coordinate: HexCoordinate,
}

export const GridRenderer: React.FC<Props> = ({
		terrain, coordinate
}) => {
	return (
		<HexCell terrain={terrain}
             coordinate={coordinate}
		         highlight={undefined} />
	)
}