import React from 'react';

interface HexCellOverlayProps {
  color: string;
  opacity?: number;
}

export const HexCellOverlay: React.FC<HexCellOverlayProps> = ({ 
  color, 
  opacity = 0.5
}) => (
  <>
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#8B4513',
        opacity,
        pointerEvents: 'none',
        clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
        zIndex: 1,
      }}
    />
    <div 
      style={{
        position: 'absolute',
        top: '2%',
        left: '2%',
        width: '96%',
        height: '96%',
        background: color,
        pointerEvents: 'none',
        clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
        zIndex: 2,
      }}
    />
  </>
); 