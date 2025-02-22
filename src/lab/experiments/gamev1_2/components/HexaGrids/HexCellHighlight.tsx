import React from 'react';
import type { UnitFaction } from '../../types/UnitData';

interface Props {
  /** Type of highlight to display */
  type?: 'hover' | 'zoc' | 'moveable';
  
  /** Faction of the unit related to this highlight (if any) */
  faction?: UnitFaction;
  
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
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
      ...style
    };

    switch (type) {
      case 'moveable':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',  // Black with 20% opacity
        };
      case 'hover':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(74, 144, 226, 0.3)',  // Light blue
        };
      case 'zoc':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(255, 0, 0, 0.1)',  // Light red
        };
      default:
        return baseStyle;
    }
  };

  return <div style={getHighlightStyle()} />;
};
