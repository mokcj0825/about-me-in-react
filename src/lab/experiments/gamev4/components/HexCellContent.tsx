import React from 'react';
import { HexCoordinate } from '../types/HexCoordinate';
import { UnitData } from '../types/UnitData';

interface HexCellContentProps {
  coordinate: HexCoordinate;
  unit?: UnitData;
}

export const HexCellContent: React.FC<HexCellContentProps> = ({ 
  coordinate,
  unit
}) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 3,
    }}
  >
    {unit ? (
      unit.faction === 'player' ? 'P' : unit.faction === 'ally' ? 'A' : 'E'
    ) : (
      `(${coordinate.x},${coordinate.y},${coordinate.z})`
    )}
  </div>
);
