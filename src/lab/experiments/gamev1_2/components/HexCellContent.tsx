import React from 'react';
import { HexCoordinate } from '../types/HexCoordinate';
import { UnitData } from '../types/UnitData';
import { DirectionIndicator } from './DirectionIndicator';

interface HexCellContentProps {
  coordinate: HexCoordinate;
  unit?: UnitData;
}

const getUnitColor = (faction: string) => {
  switch (faction) {
    case 'player':
      return '#ffeb3b';  // Yellow for player
    case 'ally':
      return '#4CAF50';  // Green for ally
    case 'enemy':
      return '#ff4444';  // Red for enemy
    default:
      return '#f0f0f0';
  }
};

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
      zIndex: 4,
      backgroundColor: unit ? getUnitColor(unit.faction) : 'transparent',
    }}
  >
    {unit && (
      <>
        {unit.faction === 'player' ? 'P' : unit.faction === 'ally' ? 'A' : 'E'}
        <DirectionIndicator 
          direction={unit.direction}
        />
      </>
    )}
  </div>
);
