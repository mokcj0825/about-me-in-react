import React, { useState } from "react";
import { HexCoordinate, getDistance } from "../types/HexCoordinate";
import { UnitData, Faction } from "../types/UnitData";
import { eventBus } from "../EventBus";
import { HexCellOverlay } from "./HexCellOverlay";
import { HexCellContent } from "./HexCellContent";
import { HexCellHighlight } from "./HexCellHighlight";

interface HexCellProps {
  coordinate: HexCoordinate;
  unit?: UnitData;
  isMoveable?: boolean;
  isInZOC?: boolean;
  onHover: (coord: HexCoordinate, isHovering: boolean, isUnit: boolean) => void;
  unitPosition: HexCoordinate | null;
  findUnitAtPosition: (coord: HexCoordinate) => UnitData | undefined;
}

const GRID = {
  WIDTH: 100
};

const getUnitColor = (faction: Faction) => {
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

const getMoveableColor = (faction: Faction) => {
  switch (faction) {
    case 'player':
      return '#90caf9';  // Light blue for player movement
    case 'ally':
      return '#98fb98';  // Light green for ally movement
    case 'enemy':
      return '#ffcdd2';  // Light red for enemy movement
    default:
      return '#f0f0f0';
  }
};

export const HexCell: React.FC<HexCellProps> = ({ 
  coordinate, 
  unit, 
  isMoveable,
  isInZOC,
  onHover,
  unitPosition,
  findUnitAtPosition
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
        eventBus.emit('unit-selected', { unitId: unit.id, position: coordinate });
      } else if (unitPosition) {
        const distance = getDistance(coordinate, unitPosition);
        alert(`Distance to unit: ${distance} hexes`);
      }
    } else if (e.button === 2) {
      console.log('menu');
    }
  };

  const getHighlightType = () => {
    if (isMoveable) return 'moveable';
    if (isInZOC) return 'zoc';
    if (isHovered && !unit) return 'hover';
    return undefined;
  };

  const getHighlightFaction = () => {
    if (isMoveable && unitPosition) {
      const sourceUnit = findUnitAtPosition(unitPosition);
      return sourceUnit?.faction;
    }
    return undefined;
  };

  const getBackgroundColor = () => {
    if (unit) return getUnitColor(unit.faction);
    if (isMoveable && unitPosition) {
      const sourceUnit = findUnitAtPosition(unitPosition);
      if (sourceUnit) return getMoveableColor(sourceUnit.faction);
    }
    if (isInZOC) return 'rgba(255, 0, 0, 0.1)';  // Light red for enemy ZOC
    if (isHovered && !unit) return '#4a90e2';
    return '#f0f0f0';
  };

  return (
    <div 
      style={{
        width: `${GRID.WIDTH}px`,
        height: `${GRID.WIDTH}px`,
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
      <HexCellOverlay />
      <HexCellHighlight 
        type={getHighlightType()} 
        faction={getHighlightFaction()} 
      />
      <HexCellContent coordinate={coordinate} unit={unit} />
    </div>
  );
}; 