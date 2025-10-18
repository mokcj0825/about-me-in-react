import React from 'react';
import { OverlaySvg } from "../../game-versioning/components/HexCellOverlay";

export const HexCellOverlay: React.FC = () => (
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
      }}
    />
    {/* SVG hexagon grid lines */}
    <OverlaySvg />
  </>
); 