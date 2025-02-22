import React from 'react';
import { UnitDirection } from '../types/UnitData';

/**
 * Props interface for the DirectionIndicator component
 * @interface DirectionIndicatorProps
 * @property {UnitDirection} direction - The direction to point the indicator towards.
 * Valid values are: 'top-right', 'right', 'bottom-right', 'bottom-left', 'left', 'top-left'
 *
 */
interface DirectionIndicatorProps {
  direction: UnitDirection;
}

/**
 * A component that renders a directional line indicator using SVG
 * 
 * @component
 * @example
 * ```tsx
 * <DirectionIndicator direction="top-right" />
 * ```
 * 
 * The component creates an SVG line that points in the specified direction.
 * It uses absolute positioning and covers its container, with the line drawn
 * according to the specified direction using predetermined coordinates.
 * 
 * @param {DirectionIndicatorProps} props - Component props
 * @param {UnitDirection} props.direction - The direction the line should point towards
 * @returns {React.ReactElement} A div containing an SVG with a directional line
 */
export const DirectionIndicator: React.FC<DirectionIndicatorProps> = ({ direction }) => {
  const getLineCoordinates = () => {
    switch (direction) {
      case 'top-right':
        return { x1: "55", y1: "10", x2: "89", y2: "27" };  // reference line
      case 'right':
        return { x1: "89", y1: "30", x2: "89", y2: "70" };  // adjusted to match style
      case 'bottom-right':
        return { x1: "89", y1: "73", x2: "55", y2: "90" };  // mirror of top-right
      case 'bottom-left':
        return { x1: "45", y1: "90", x2: "11", y2: "73" };  // mirror of top-right
      case 'left':
        return { x1: "11", y1: "70", x2: "11", y2: "30" };  // mirror of right
      case 'top-left':
        return { x1: "11", y1: "27", x2: "45", y2: "10" };  // mirror of top-right
    }
  };

  const coords = getLineCoordinates();

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line
          {...coords}
          stroke="gray"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}; 