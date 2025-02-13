import React, { useState } from "react";
import { HexCoordinate, getDistance } from "../types/HexCoordinate";
import { UnitData } from "../types/UnitData";
import { eventBus } from "../EventBus";

interface HexCellProps {
  coordinate: HexCoordinate;
  unit?: UnitData;
  isMoveable?: boolean;
  onHover: (coord: HexCoordinate, isHovering: boolean, isUnit: boolean) => void;
  unitPosition?: HexCoordinate;
}

const GRID = {
  WIDTH: 100
};

export const HexCell: React.FC<HexCellProps> = ({ 
  coordinate, 
  unit, 
  isMoveable,
  onHover,
  unitPosition 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(coordinate, true, !!unit);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(coordinate, false, !!unit);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (e.button === 0) {
      if (unit) {
        console.log(`Selected unit at (${coordinate.x}, ${coordinate.y}, ${coordinate.z}) with movement ${unit.movement}`);
        eventBus.emit('unit-selected', { unitId: unit.id, position: coordinate });
      } else if (unitPosition) {
        const distance = getDistance(coordinate, unitPosition);
        alert(`Distance to unit: ${distance} hexes`);
      }
    } else if (e.button === 2) {
      console.log('menu');
    }
  };

  return (
    <div 
      style={{
        width: `${GRID.WIDTH}px`,
        height: `${GRID.WIDTH}px`,
        backgroundColor: isHovered ? '#4a90e2' : 
                        isMoveable ? '#98fb98' :
                        unit ? '#ffeb3b' : '#f0f0f0',
        clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'default',
        userSelect: 'none',
        fontSize: '12px',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        flexShrink: 0,
        flexGrow: 0,
        position: 'relative',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onContextMenu={handleClick}
    >
      {unit ? 'U' : `(${coordinate.x},${coordinate.y},${coordinate.z})`}
    </div>
  );
}; 