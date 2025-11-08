import React, { useState } from "react";
import { UnitData } from "../types/UnitData";
import { eventBus } from "../EventBus";
import { HexCellOverlay } from "./HexCellOverlay";
import { HexCellContent } from "./HexCellContent";
import { HexCellHighlight } from "./HexCellHighlight";
import { UnitInfoDisplay } from './UnitInfoDisplay';
import { getDistance, HexCoordinate } from "../../game-versioning/types/HexCoordinate";
import {GRID} from "../../game-versioning/components/HexCell";
import {UnitFraction} from "../../game-versioning/types/UnitData";

interface HexCellProps {
  coordinate: HexCoordinate;
  unit?: UnitData;
  isMoveable?: boolean;
  isInZOC?: boolean;
  onHover: (coord: HexCoordinate, isHovering: boolean, isUnit: boolean) => void;
  unitPosition: HexCoordinate | null;
  findUnitAtPosition: (coord: HexCoordinate) => UnitData | undefined;
}

const DEBUG_MODE = false;

const getUnitColor = (fraction: UnitFraction) => {
  switch (fraction) {
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

const getMoveableColor = (fraction: UnitFraction) => {
  switch (fraction) {
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
  const [showInfo, setShowInfo] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (unit) {
      setShowInfo(true);
      setMousePos({ x: e.clientX, y: e.clientY });
    }
    setIsHovered(true);
    onHover(coordinate, true, !!unit);
  };

  const handleMouseLeave = () => {
    setShowInfo(false);
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
        if (DEBUG_MODE) {
          alert(`Distance to unit: ${distance} hexes`);
        }
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

  const getHighlightFraction = () => {
    if (isMoveable && unitPosition) {
      const sourceUnit = findUnitAtPosition(unitPosition);
      return sourceUnit?.fraction;
    }
    return undefined;
  };

  const getBackgroundColor = () => {
    if (unit) return getUnitColor(unit.fraction);
    if (isMoveable && unitPosition) {
      const sourceUnit = findUnitAtPosition(unitPosition);
      if (sourceUnit) return getMoveableColor(sourceUnit.fraction);
    }
    if (isInZOC) return "rgba(255, 0, 0, 0.1)"; // Light red for enemy ZOC
    if (isHovered && !unit) return "#4a90e2";
    return "#f0f0f0";
  };

  return (
    <>
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          clipPath:
            "polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)",
          cursor: "default",
          display: "flex",
          flexGrow: 0,
          flexShrink: 0,
          fontSize: "12px",
          height: `${GRID.WIDTH}px`,
          justifyContent: "center",
          margin: 0,
          padding: 0,
          position: "relative",
          transition: "background-color 0.2s ease",
          userSelect: "none",
          width: `${GRID.WIDTH}px`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onContextMenu={handleClick}
      >
        <HexCellOverlay />
        <HexCellHighlight
          type={getHighlightType()}
          fraction={getHighlightFraction()}
        />
        <HexCellContent coordinate={coordinate} unit={unit} />
      </div>
      {showInfo && unit && (
        <UnitInfoDisplay unit={unit} mousePosition={mousePos} />
      )}
    </>
  );
}; 