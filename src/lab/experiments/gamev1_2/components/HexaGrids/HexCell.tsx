import React, { useState } from "react";
import { HexCoordinate } from "../../types/HexCoordinate";
import { UnitData } from "../../types/UnitData";
import { HexCellOverlay } from "./HexCellOverlay";
import { HexCellContent } from "./HexCellContent";
import { HexCellHighlight } from "./HexCellHighlight";
import { UnitInfoDisplay } from '../DisplayPanel/UnitInfoDisplay';
import type { TerrainType } from '../../movement/types'
import { HexCellHoverIndicator } from './HexCellHoverIndicator';
import { HexCellContainer } from './HexCellContainer';

/**
 * Props interface for the HexCell component
 * @interface Props
 */
interface Props {
  /** The coordinate position of this hex cell in the game grid */
  coordinate: HexCoordinate;
  
  /** The unit data if a unit is present in this cell */
  unit?: UnitData;
  
  /** The type of terrain in this cell */
  terrain: TerrainType;
  
  /** Whether this cell is a valid movement destination for the selected unit */
  isMoveable?: boolean;
  
  /** Whether this cell is in an enemy unit's zone of control */
  isInZOC?: boolean;
  
  /** 
   * Callback function for hover events
   * @param coord - The coordinate of the cell being hovered
   * @param isHovering - Whether the mouse is entering (true) or leaving (false)
   * @param isUnit - Whether there is a unit in the cell
   */
  onHover: (coord: HexCoordinate, isHovering: boolean, isUnit: boolean) => void;
  
  /** The coordinate of the currently selected unit, if any */
  unitPosition: HexCoordinate | null;
  
  /** 
   * Function to find a unit at a given coordinate
   * @param coord - The coordinate to check for a unit
   * @returns The unit data if found, undefined otherwise
   */
  findUnitAtPosition: (coord: HexCoordinate) => UnitData | undefined;
  
  /**
   * Callback function for click events
   * @param coord - The coordinate of the clicked cell
   * @param isRightClick - Whether the click was a right click
   */
  onClick: (coord: HexCoordinate, isRightClick?: boolean) => void;
  
  /** Whether this cell is currently selected */
  isSelected?: boolean;
  
  /** The array of units present in this cell */
  units: UnitData[];
}

/**
 * HexCell component - Represents a single hexagonal cell in the game grid
 * 
 * This component serves as the fundamental building block of the game board,
 * managing the display and interaction logic for a single hexagonal cell.
 * 
 * Features:
 * - Displays terrain and unit information
 * - Handles mouse interactions (hover, click)
 * - Shows movement possibilities and zones of control
 * - Displays unit information on hover
 * - Manages selection state
 * 
 * The component uses a layered approach with different z-indexes:
 * 1. Base terrain (HexCellContainer)
 * 2. Overlay effects
 * 3. Movement/ZOC highlights
 * 4. Unit content
 * 5. Hover/Selection indicators
 * 
 * @component
 * @example
 * ```tsx
 * <HexCell
 *   coordinate={{ x: 0, y: 0 }}
 *   terrain="plains"
 *   unit={unitData}
 *   isMoveable={true}
 *   onHover={(coord, isHovering, isUnit) => handleHover(coord, isHovering, isUnit)}
 *   onClick={(coord, isRightClick) => handleClick(coord, isRightClick)}
 *   findUnitAtPosition={(coord) => getUnitAt(coord)}
 * />
 * ```
 */
export const HexCell: React.FC<Props> = ({
  coordinate, 
  units, 
  terrain,
  isMoveable,
  isInZOC,
  onHover,
  unitPosition,
  findUnitAtPosition,
  onClick,
  isSelected,
}) => {
  // State for handling hover interactions and unit info display
  const [isHovered, setIsHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /**
   * Handles mouse enter events on the cell
   * Shows unit info if a unit is present and triggers hover callback
   */
  const handleMouseEnter = (e: React.MouseEvent) => {
    if (units.length > 0) {
      setShowInfo(true);
      setMousePos({ x: e.clientX, y: e.clientY });
    }
    setIsHovered(true);
    onHover(coordinate, true, units.length > 0);
  };

  /**
   * Handles mouse leave events on the cell
   * Hides unit info and triggers hover callback
   */
  const handleMouseLeave = () => {
    setShowInfo(false);
    setIsHovered(false);
    onHover(coordinate, false, units.length > 0);
  };

  /**
   * Handles click events on the cell
   * Prevents default context menu and triggers click callback
   */
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(coordinate, e.button === 2);
  };

  const renderUnit = (unit: UnitData) => {
    return (
      <div className={`unit ${unit.faction}`}>
        {unit.name}
      </div>
    );
  };

  return (
    <>
      <HexCellContainer
        terrain={terrain}
        isSelected={isSelected}
        isHovered={isHovered}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <HexCellOverlay style={{ zIndex: 1 }} />
        <HexCellHighlight 
          type={isMoveable ? 'moveable' : isInZOC ? 'zoc' : undefined} 
          faction={isMoveable && unitPosition ? findUnitAtPosition(unitPosition)?.faction : undefined} 
          style={{ zIndex: 2 }}
        />
        <HexCellContent 
          coordinate={coordinate} 
          unit={units.length > 0 ? units[0] : undefined} 
          style={{ zIndex: 3 }}
        />
        <HexCellHoverIndicator 
          isHovered={isHovered} 
          isSelected={isSelected || false} 
          style={{ zIndex: 5 }}
        />
        {units.length > 0 && (
          <div className="unit-stack">
            <div className="unit-primary">
              {renderUnit(units[0])}
            </div>
            
            {units.length > 1 && (
              <div className="unit-stack-indicator">
                +{units.length - 1}
              </div>
            )}
          </div>
        )}
      </HexCellContainer>
      {showInfo && units.length > 0 && (
        <UnitInfoDisplay unit={units[0]} mousePosition={mousePos} />
      )}
    </>
  );
}; 