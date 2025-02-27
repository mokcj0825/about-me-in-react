import React from 'react';
import type { TerrainType } from '../../movement/types';
import { getTerrainDescription } from '../../utils/terrainUtils';

const TERRAIN_LABELS: Record<TerrainType, string> = {
  'plain': '平地',
  'mountain': '山地',
  'forest': '森林',
  'sea': '海洋',
  'river': '河流',
  'cliff': '悬崖',
  'road': '道路',
  'wasteland': '荒地',
  'ruins': '遗迹',
  'swamp': '沼泽'
};

interface Props {
  /** The terrain type to display information for */
  terrain: TerrainType;
  
  /** The current mouse position to position the info display */
  mousePosition: { x: number; y: number };
}

/**
 * TerrainInfoDisplay component - Renders a floating information panel for terrain
 * Shows terrain type and movement implications in a compact format
 */
export const TerrainInfoDisplay: React.FC<Props> = ({ terrain, mousePosition }) => {
  // Add a buffer zone around the middle
  const MIDDLE_BUFFER = 100; // pixels from center where we'll force a side
  const screenMiddle = window.innerWidth / 2;
  const isLeftSide = mousePosition.x < (screenMiddle - MIDDLE_BUFFER);
  const isRightSide = mousePosition.x > (screenMiddle + MIDDLE_BUFFER);
  
  // If in buffer zone, default to right side
  const displaySide = isLeftSide ? 'right' : 'left';

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '15px',
    [displaySide]: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: '8px 12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    zIndex: 99,
    width: '200px',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  };

  return (
    <div style={containerStyle}>
      <div style={{ 
        fontSize: '14px', 
        fontWeight: 'bold',
        marginBottom: '4px',
        textTransform: 'capitalize' 
      }}>
        {TERRAIN_LABELS[terrain]}
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

TerrainInfoDisplay.displayName = 'TerrainInfoDisplay'; 