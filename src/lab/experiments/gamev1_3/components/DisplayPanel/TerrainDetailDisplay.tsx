import React from 'react';
import type { TerrainType } from '../../movement/types';
import { getTerrainDescription } from '../../utils/terrainUtils';
import { TERRAIN_LABELS } from '../../utils/terrainUtils';
import { MovementType } from '../../movement/types';
import { movementCostRegistry } from '../../movement/registry/MovementCostRegistry';

interface Props {
	visible: boolean;
	terrain: TerrainType;
	onClose: () => void;
}

export const TerrainDetailDisplay: React.FC<Props> = ({ visible, terrain, onClose }) => {
	if (!visible) return null;

	const movementTypes: MovementType[] = ['foot', 'ooze', 'float', 'flying'];
	const costs = movementTypes.map(type => ({
		type,
		cost: movementCostRegistry.getMovementCost(terrain, type)
	}));

	return (
		<div style={displayStyle}>
			<TitlePanel onClose={onClose} />

			<div style={{
				display: 'flex',
				gap: '20px',
			}}>
				<LeftSidePanel terrain={terrain} />
				
				<RightSidePanel terrain={terrain} />
				
			</div>
		</div>
	);
};


const TitlePanel: React.FC<{onClose: () => void}> = ({ onClose }) => {
  return (
    <div style={titleWrapper}>
      <h2 style={{ margin: 0, fontSize: "18px" }}>地形信息</h2>
      <button onClick={onClose} style={titleCloseButton}>
        ×
      </button>
    </div>
  );
};

const LeftSidePanel: React.FC<{ terrain: TerrainType }> = ({ terrain }) => {
  return (
    <div style={leftSidePanelWrapper}>
      <img
        src={`/terrain-image/background_${terrain}.jpeg`}
        alt={TERRAIN_LABELS[terrain]}
        style={leftSideImage}
      />
    </div>
  );
};

const RightSidePanel: React.FC<{ terrain: TerrainType }> = ({ terrain }) => {
  return (
    <div
      style={{
        flex: 1,
      }}
    >
      <div
        style={{
          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "4px",
        }}
      >
        <TerrainLabels terrain={terrain} />
        <TerrainDescription terrain={terrain} />
        <MovementCostDisplay terrain={terrain} />
      </div>
    </div>
  );
};

const TerrainLabels: React.FC<{ terrain: TerrainType }> = ({
  terrain
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "8px",
      }}
    >
      <img
        src={`/map-terrain/${terrain}.svg`}
        alt={TERRAIN_LABELS[terrain]}
        style={{ width: "24px", height: "24px" }}
      />
      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
        {TERRAIN_LABELS[terrain]}
      </span>
    </div>
  );
};

const TerrainDescription: React.FC<{ terrain: TerrainType }> = ({terrain}) => {
  return (
    <div style={{ color: "rgba(255, 255, 255, 0.8)" }}>
      {getTerrainDescription(terrain)}
    </div>
  );
};

const MovementCostDisplay: React.FC<{ terrain: TerrainType }> = ({terrain}) => {
  const movementTypes: MovementType[] = ['foot', 'ooze', 'float', 'flying'];
  const costs = movementTypes.map(type => ({
    type,
    cost: movementCostRegistry.getMovementCost(terrain, type)
  }));

  return (
    <div style={{ marginTop: "8px", fontSize: "12px" }}>
      <div style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "4px" }}>
        移动消耗:
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "4px",
          fontSize: "11px",
        }}
      >
        {costs.map(({ type, cost }) => (
          <div key={type} className="cost-row">
            <span>{type}: </span>
            <span>{cost === 99 ? '不可通行' : cost}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const displayStyle: React.CSSProperties = {
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	backgroundColor: 'rgba(0, 0, 0, 0.95)',
	padding: '20px',
	border: '1px solid rgba(255, 255, 255, 0.2)',
	borderRadius: '8px',
	zIndex: 100,
	width: '600px',
	color: 'white',
	fontFamily: 'Arial, sans-serif',
};

const titleWrapper = {
	borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
	paddingBottom: "10px",
	marginBottom: "15px",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
} as const;

const titleCloseButton  = {
	background: "none",
	border: "none",
	color: "white",
	cursor: "pointer",
	fontSize: "20px",
} as const;

const leftSidePanelWrapper = {
	width: "200px",
	height: "200px",
	borderRadius: "4px",
	overflow: "hidden" as const,
	flexShrink: 0,
};

const leftSideImage = {
	width: "100%",
	height: "100%",
	objectFit: "cover" as const,
	objectPosition: "center" as const,
};