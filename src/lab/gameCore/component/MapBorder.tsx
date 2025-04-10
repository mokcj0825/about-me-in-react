import React from 'react';

interface MapBordersProps {
  onScroll: (direction: 'left' | 'right' | 'up' | 'down') => void;
  onStopScroll: () => void;
}

export const MapBorder: React.FC<MapBordersProps> = ({ onScroll, onStopScroll }) => {

  return (
    <>
      {/* Left Border */}
      <div
        style={{
          ...borderStyle,
          left: 0,
          top: 0,
          width: '50px',
          height: '100%',
          cursor: 'w-resize',
        }}
        onMouseEnter={() => onScroll('left')}
        onMouseLeave={onStopScroll}
      />
      {/* Right Border */}
      <div
        style={{
          ...borderStyle,
          right: 0,
          top: 0,
          width: '50px',
          height: '100%',
          cursor: 'e-resize',
        }}
        onMouseEnter={() => onScroll('right')}
        onMouseLeave={onStopScroll}
      />
      {/* Top Border */}
      <div
        style={{
          ...borderStyle,
          left: 0,
          top: 0,
          width: '100%',
          height: '50px',
          cursor: 'n-resize',
        }}
        onMouseEnter={() => onScroll('up')}
        onMouseLeave={onStopScroll}
      />
      {/* Bottom Border */}
      <div
        style={{
          ...borderStyle,
          left: 0,
          bottom: 0,
          width: '100%',
          height: '50px',
          cursor: 's-resize',
        }}
        onMouseEnter={() => onScroll('down')}
        onMouseLeave={onStopScroll}
      />
    </>
  );
};

const borderStyle: React.CSSProperties = {
  position: 'absolute',
  backgroundColor: 'rgba(0, 0, 0, 0)',
  zIndex: 10,
};