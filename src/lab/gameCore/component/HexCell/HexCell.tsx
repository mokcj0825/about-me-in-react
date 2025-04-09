import {HexCoordinate} from "../../types/HexCoordinate";
import React, {useState} from "react";
import {Container} from "./Container";
import {TerrainType} from "../../types/TerrainType";
import {HighlightType} from "../../types/HighlightType";

interface Props {
	terrain: TerrainType,
	coordinate: HexCoordinate,
	highlight?: HighlightType,
}

export const HexCell: React.FC<Props> = ({
	                                         terrain,
	                                         coordinate,
	                                         highlight
                                         }) => {

	const [isHovered, setIsHovered] = useState(false);

	const getHighlightType = (): HighlightType | undefined => {
		if (highlight === 'selection') return 'selection';
		if (highlight === 'effect') return 'effect';
		//if (isMoveable) return 'moveable';
		//if (isInZOC) return 'zoc';
		return undefined;
	};

	return (
		<>
			<Container terrain={terrain} isHovered={isHovered} >
				<Overlay />
				<Highlight highlightType={getHighlightType()}
				           fraction='player' />
				<CellContent coordinate={coordinate}/>
				<HoverIndicator isHovered={isHovered} />
			</Container>
		</>
	)
}

const Overlay: React.FC = () => (
	<>
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				backgroundColor: '#FFFFFF',
				opacity: 0.2,
				pointerEvents: 'none',
				zIndex: 1,
			}}
		/>
		<svg
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				pointerEvents: 'none',
				zIndex: 2,
			}}
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
		>
			<path
				d="M0 25 L0 75 L50 100 L100 75 L100 25 L50 0 Z"
				fill="none"
				stroke="#8B4513"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	</>
);

const Highlight: React.FC<{
	highlightType: HighlightType | undefined,
	fraction: string
}> = ({
	      highlightType,
	      fraction,
      }) => {
	if (!highlightType) return null;

	const getHighlightStyle = (): React.CSSProperties => {
		switch (highlightType) {
			case 'selection':
				return {
					backgroundColor: 'rgba(255, 255, 0, 0.3)',
					border: '2px solid rgba(255, 255, 0, 0.6)'
				};
			case 'effect':
				return {
					backgroundColor: 'rgba(255, 0, 0, 0.3)',
					border: '2px solid rgba(255, 0, 0, 0.6)'
				};
			case 'moveable':
				return {
					backgroundColor: fraction === 'enemy' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)',
					border: `2px solid ${fraction === 'enemy' ? 'rgba(255, 0, 0, 0.4)' : 'rgba(0, 255, 0, 0.4)'}`
				};
			case 'zoc':
				return {
					backgroundColor: 'rgba(255, 165, 0, 0.2)',
					border: '2px solid rgba(255, 165, 0, 0.4)'
				};
			default:
				return {};
		}
	};

	return (
		<div
			className="hex-cell-highlight"
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				pointerEvents: 'none',
				zIndex: 2,
				...getHighlightStyle(),
			}}
		/>
	);
};

const CellContent: React.FC<{coordinate: HexCoordinate}> = ({
	                                                            coordinate
                                                            }) => (
	<div style={{
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		pointerEvents: 'none',
		zIndex: 3
	}}
	>

		<div style={{
			position: 'absolute',
			bottom: '2px',
			left: '2px',
			fontSize: '10px',
			color: 'rgba(0, 0, 0, 0.7)'
		}}>
			{coordinate.x},{coordinate.y}
		</div>

	</div>
)

const HoverIndicator: React.FC <{isHovered: boolean; isSelected?: boolean}> = ({isHovered, isSelected = false}) => {
	return (<div
		style={{
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
			backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
			outline: isSelected ? '2px solid yellow' : 'none',
			transition: 'all 0.2s ease',
			pointerEvents: 'none',
			zIndex: 5,
		}}
	/>)
}