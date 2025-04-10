import React from "react";
import {TerrainType} from "../../types/TerrainType";


interface Props {
	terrain: TerrainType;
	isHovered: boolean;
	children: React.ReactNode;
}

const GRID = {
	WIDTH: 100
};

export const Container: React.FC<Props> = ({
	terrain,
	isHovered,
	children
}) => {
	const isSelected = false;

	const onMouseEnter = () => {console.log('Not implemented')}
	const onMouseLeave = () => {console.log('Not implemented')}
	const onClick = () => {console.log('Not implemented')}
	const onContextMenu = () => {console.log('Not implemented')}

	return (
		<div style={{
			width: `${GRID.WIDTH}px`,
			height: `${GRID.WIDTH}px`,
			clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			cursor: 'default',
			userSelect: 'none',
			fontSize: '12px',
			margin: 0,
			padding: 0,
			boxSizing: 'border-box',
			flexShrink: 0,
			flexGrow: 0,
			position: 'relative',
			transition: 'background-color 0.2s ease',
			outline: isSelected
				? '2px solid yellow'
				: isHovered
					? '2px solid rgba(255, 255, 255, 0.5)'
					: undefined,
			zIndex: isHovered ? 3 : 1,
		}}
		     onMouseEnter={onMouseEnter}
		     onMouseLeave={onMouseLeave}
		     onClick={onClick}
		     onContextMenu={onClick}
		>
			{children}
		</div>
	)
}

const getBackgroundStyle = (terrain: TerrainType) => {
	return {
		backgroundImage: `url(${getTerrainSvgPath(terrain)})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	};
};

const terrainSvgMap: Record<TerrainType, string> = {
  plain: '/map-terrain/plain.svg',
  road: '/map-terrain/road.svg',
  forest: '/map-terrain/forest.svg',
  cliff: '/map-terrain/cliff.svg',
  mountain: '/map-terrain/mountain.svg',
  wasteland: '/map-terrain/wasteland.svg',
  ruins: '/map-terrain/ruins.svg',
  river: '/map-terrain/river.svg',
  swamp: '/map-terrain/swamp.svg',
  sea: '/map-terrain/sea.svg'
}

const getTerrainSvgPath = (terrain: TerrainType): string => {
  return terrainSvgMap[terrain]
}