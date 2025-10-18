import React from 'react';
import { getTerrainSvgPath } from '../../utils/terrainLoader';
import type { TerrainType } from '../../movement/types';
import { GRID } from "../../../game-versioning/components/HexCell";

/**
 * Props interface for the HexCellContainer component
 * @interface Props
 */
interface Props {
    /** Type of terrain to be displayed in the cell */
  terrain: TerrainType;
  
  /** Whether the cell is currently selected */
  isSelected?: boolean;
  
  /** Whether the cell is currently being hovered over */
  isHovered: boolean;
  
  /** Handler for mouse enter events */
  onMouseEnter: (e: React.MouseEvent) => void;
  
  /** Handler for mouse leave events */
  onMouseLeave: () => void;
  
  /** Handler for click events (both left and right click) */
  onClick: (e: React.MouseEvent) => void;
  
  /** Child elements to be rendered inside the hex cell */
  children: React.ReactNode;
}

/**
 * Gets the background style object for the terrain
 * @param terrain - The type of terrain to display
 * @returns Object containing background image styling properties
 */
const getBackgroundStyle = (terrain: TerrainType) => {
  return {
    backgroundImage: `url(${getTerrainSvgPath(terrain)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
};

/**
 * HexCellContainer component - Renders a hexagonal cell container with terrain background
 * 
 * This component handles the visual representation of a hexagonal cell in the game grid.
 * It provides:
 * - Hexagonal shape using CSS clip-path
 * - Terrain background display
 * - Visual feedback for hover and selection states
 * - Mouse interaction handling
 * - Container for child components (unit displays, overlays, etc.)
 * 
 * @component
 * @example
 * ```tsx
 * <HexCellContainer
 *   width={100}
 *   terrain="plains"
 *   isSelected={false}
 *   isHovered={false}
 *   onMouseEnter={(e) => handleMouseEnter(e)}
 *   onMouseLeave={() => handleMouseLeave()}
 *   onClick={(e) => handleClick(e)}
 * >
 *   <UnitDisplay />
 * </HexCellContainer>
 * ```
 */
export const HexCellContainer: React.FC<Props> = ({
  terrain,
  isSelected,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
  children,
}) => {
  return (
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
        outline: isSelected
          ? "2px solid yellow"
          : isHovered
            ? "2px solid rgba(255, 255, 255, 0.5)"
            : undefined,
        padding: 0,
        position: "relative",
        transition: "background-color 0.2s ease",
        userSelect: "none",
        ...getBackgroundStyle(terrain),
        width: `${GRID.WIDTH}px`,
        zIndex: isHovered ? 3 : 1,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onContextMenu={onClick}
    >
      {children}
    </div>
  );
}; 