import React from 'react';

interface HexCellHighlightProps {
  type?: 'hover' | 'zoc' | 'moveable';
  faction?: 'player' | 'ally' | 'enemy';
}

export const HexCellHighlight: React.FC<HexCellHighlightProps> = ({ 
  type,
  faction
}) => {
  const getHighlightColor = () => {
    if (!type) return 'transparent';
    
    switch (type) {
      case 'hover':
        return '#4a90e2';
      case 'zoc':
        return 'rgba(255, 0, 0, 0.1)';
      case 'moveable':
        switch (faction) {
          case 'player': return '#90caf9';
          case 'ally': return '#98fb98';
          case 'enemy': return '#ffcdd2';
          default: return '#f0f0f0';
        }
      default:
        return 'transparent';
    }
  };

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: getHighlightColor(),
        opacity: 0.3,
        pointerEvents: 'none',
        zIndex: 3,
      }}
    />
  );
};
