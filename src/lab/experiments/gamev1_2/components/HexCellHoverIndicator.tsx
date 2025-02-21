import React from 'react';

interface HexCellHoverIndicatorProps {
  isHovered: boolean;
  isSelected: boolean;
  style?: React.CSSProperties;
}

export const HexCellHoverIndicator: React.FC<HexCellHoverIndicatorProps> = ({ 
  isHovered, 
  isSelected,
  style 
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
        backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
        outline: isSelected ? '2px solid yellow' : 'none',
        transition: 'all 0.2s ease',
        pointerEvents: 'none',
        ...style
      }}
    />
  );
}; 