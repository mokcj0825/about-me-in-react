import React from 'react';
import { HexCoordinate } from '../../../game-versioning/types/HexCoordinate';
import { UnitData } from '../../types/UnitData';
import { TerrainType } from '../../movement/types';
import { HexCell } from '../HexaGrids/HexCell';

interface GridRendererProps {
  /** The coordinate to render */
  coord: HexCoordinate;
  /** Array of units at this position */
  units: UnitData[];
  /** Terrain type at this position */
  terrain: TerrainType;
  /** Whether this cell is moveable */
  isMoveable: boolean;
  /** Currently selected unit position */
  selectedUnitPosition: HexCoordinate | null;
  /** Currently selected unit */
  selectedUnit: UnitData | null;
  /** Function to find unit at a position */
  findUnitAtPosition: (coord: HexCoordinate) => UnitData | undefined;
  /** Selection area coordinates */
  selectionArea: HexCoordinate[];
  /** Effect preview area coordinates */
  effectPreviewArea: HexCoordinate[];
  /** Hover handler */
  onHover: (coord: HexCoordinate, isHovering: boolean, isUnit: boolean) => void;
  /** Click handler */
  onClick: (coord: HexCoordinate, isRightClick?: boolean) => void;
}

/**
 * GridRenderer component - Handles rendering of individual hex cells
 * 
 * @component
 */
export const GridRenderer: React.FC<GridRendererProps> = ({
  coord,
  units,
  terrain,
  isMoveable,
  selectedUnitPosition,
  selectedUnit,
  findUnitAtPosition,
  selectionArea,
  effectPreviewArea,
  onHover,
  onClick
}) => {
  const isInSelectionArea = selectionArea.some(
    area => area.x === coord.x && area.y === coord.y
  );

  const isInEffectArea = effectPreviewArea.some(
    area => area.x === coord.x && area.y === coord.y
  );

  return (
    <HexCell 
      key={`${coord.x},${coord.y}`} 
      coordinate={coord}
      units={units}
      terrain={terrain}
      isMoveable={isMoveable}
      onHover={onHover}
      onClick={onClick}
      unitPosition={selectedUnitPosition}
      findUnitAtPosition={findUnitAtPosition}
      isSelected={selectedUnit !== null && 
        coord.x === selectedUnitPosition?.x && 
        coord.y === selectedUnitPosition?.y}
      highlight={isInEffectArea ? 'effect' : isInSelectionArea ? 'selection' : undefined}
    />
  );
}; 