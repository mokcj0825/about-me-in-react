import React, {useMemo} from 'react';
import type { TerrainType } from '../../movement/types';
import { getTerrainDescription } from '../../utils/terrainUtils';
import terrainData from '../../data/terrain-data.json';
import {Z_INDEX} from "../../constants/zIndex";

interface Props {
  terrain: TerrainType;
  mousePosition: { x: number; y: number };
}

/**
 * TerrainInfoDisplay component - Renders a floating information panel for terrain
 * Shows terrain type and movement implications in a compact format
 */
export const TerrainInfoDisplay: React.FC<Props> = ({ terrain, mousePosition }) => {

  const containerStyle = useMemo(() => getContainerStyle(mousePosition), [mousePosition]);

  return (
    <div style={containerStyle}>
      <div style={labelStyle}>
        {terrainData.labels[terrain]}
      </div>
      <div style={{ 
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: '1.4' 
      }}>
        {getTerrainDescription(terrain)}
      </div>
    </div>
  );
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  marginBottom: '4px',
  textTransform: 'capitalize' as const,
}

TerrainInfoDisplay.displayName = 'TerrainInfoDisplay';

const getContainerStyle = (mousePosition: { x: number }): React.CSSProperties => {
  const MIDDLE_BUFFER = 100;
  const screenMiddle = window.innerWidth / 2;
  const isLeftSide = mousePosition.x < screenMiddle - MIDDLE_BUFFER;
  const displaySide = isLeftSide ? "right" : "left";

  return {
    position: "fixed",
    bottom: "15px",
    [displaySide]: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: "8px 12px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "4px",
    zIndex: Z_INDEX.TERRAIN_INFO,
    width: "200px",
    color: "white",
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
  };
};