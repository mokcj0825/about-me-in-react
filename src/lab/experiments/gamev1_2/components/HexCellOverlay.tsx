import React from 'react';

interface HexCellOverlayProps {
  style?: React.CSSProperties;
}

export const HexCellOverlay: React.FC<HexCellOverlayProps> = ({ style }) => (
  <>
    {/* Content fill */}
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
        ...style,
      }}
    />
    {/* SVG hexagon grid lines */}
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