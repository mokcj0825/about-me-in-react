import React from 'react';
import { OverlaySvg } from "../../../game-versioning/components/HexCellOverlay";

interface Props {
  /** Optional CSS styles to apply to the overlay */
  style?: React.CSSProperties;
}

/**
 * HexCellOverlay component - Renders a hex cell overlay with borders
 * 
 * Provides two layers:
 * 1. A semi-transparent white fill for visual depth
 * 2. An SVG hexagonal border with a brown stroke
 * 
 * The component uses absolute positioning and SVG paths to create
 * the hexagonal shape and border effect.
 * 
 * @component
 * @example
 * ```tsx
 * <HexCellOverlay style={{ zIndex: 1 }} />
 * ```
 */
export const HexCellOverlay: React.FC<Props> = ({ style }) => (
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
    <OverlaySvg />
  </>
); 