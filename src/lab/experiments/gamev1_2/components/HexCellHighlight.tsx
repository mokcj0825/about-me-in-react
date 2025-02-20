import React from 'react';

interface HexCellHighlightProps {
  type?: 'hover' | 'zoc' | 'moveable';
  faction?: 'player' | 'ally' | 'enemy';
}

export const HexCellHighlight: React.FC<HexCellHighlightProps> = ({ 
  type,
  faction
}) => {
  if (!type) return null;

  const getHighlightStyle = (): React.CSSProperties => {
    switch (type) {
      case 'moveable':
        return {
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',  // Black with 20% opacity
          clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
          pointerEvents: 'none'
        };
      case 'hover':
        return {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#4a90e2',
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 3,
        };
      case 'zoc':
        return {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 3,
        };
      default:
        return {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 3,
        };
    }
  };

  return <div style={getHighlightStyle()} />;
};
