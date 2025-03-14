import React from 'react';

interface Props {
  /** Whether the cell is currently being hovered over */
  isHovered: boolean;
  
  /** Whether the cell is currently selected */
  isSelected: boolean;
  
  /** Optional CSS styles to apply to the indicator */
  style?: React.CSSProperties;
}

/**
 * HexCellHoverIndicator component - Renders hover and selection visual feedback
 * 
 * Provides visual indicators for:
 * - Mouse hover state (semi-transparent overlay)
 * - Selection state (yellow outline)
 * 
 * The component uses absolute positioning within its parent hex cell and
 * maintains the hexagonal shape using clip-path.
 * 
 * @component
 * @example
 * ```tsx
 * <HexCellHoverIndicator
 *   isHovered={true}
 *   isSelected={false}
 *   style={{ zIndex: 5 }}
 * />
 * ```
 */
export const HexCellHoverIndicator: React.FC<Props> = ({ 
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