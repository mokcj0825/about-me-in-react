import React from 'react';
import type { UnitFaction } from '../../types/UnitData';

interface Props {
  /** Type of highlight to display */
  type?: 'moveable' | 'zoc' | 'selection' | 'effect';
  
  /** Faction of the unit related to this highlight (if any) */
  faction?: string;
  
  /** Optional CSS styles to apply to the highlight */
  style?: React.CSSProperties;
}

/**
 * HexCellHighlight component - Renders visual highlights for hex cells
 * 
 * Provides visual feedback for:
 * - Movement possibilities
 * - Zone of Control
 * - Hover states
 * 
 * @component
 */
export const HexCellHighlight: React.FC<Props> = ({ 
  type,
  faction,
  style
}) => {
  if (!type) return null;

  const getHighlightStyle = (): React.CSSProperties => {
    switch (type) {
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
          backgroundColor: faction === 'enemy' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)',
          border: `2px solid ${faction === 'enemy' ? 'rgba(255, 0, 0, 0.4)' : 'rgba(0, 255, 0, 0.4)'}`
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
        ...getHighlightStyle(),
        ...style
      }}
    />
  );
};
