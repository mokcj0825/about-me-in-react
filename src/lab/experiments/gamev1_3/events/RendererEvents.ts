import { HexCoordinate } from "../../game-versioning/types/HexCoordinate";
import { UnitData } from "../types/UnitData";
import { UIModalState } from "../types/UIState";
import { MovementCalculator } from "../movement/MovementCalculator";
import {DEBUGGING_MODE} from "../config";

interface RendererState {
  units: UnitData[];
  setSelectedUnit: (unit: UnitData | null) => void;
  setSelectedUnitPosition: (pos: HexCoordinate | null) => void;
  setMoveableGrids: (grids: HexCoordinate[]) => void;
  setUiModal: (modal: UIModalState) => void;
  mousePosition: { x: number; y: number } | null;
  movementCalculator: MovementCalculator;
  selectedUnit: UnitData | null;
  moveableGrids: HexCoordinate[];
  setUnits: (units: UnitData[]) => void;
}

export const onUnitSelected = (
  coord: HexCoordinate,
  state: RendererState
) => {
  // If we have a selected unit and the clicked coord is in moveable grids,
  // this is a move action, not a selection action
  if (state.selectedUnit && state.moveableGrids.some(grid => 
    grid.x === coord.x && grid.y === coord.y
  )) {
    return;  // Let the movement handler deal with this
  }

  const unitsAtPosition = state.units.filter(unit => 
    unit.position.x === coord.x && unit.position.y === coord.y
  );

  if (unitsAtPosition.length > 0) {
    // Filter for player units only
    let playerUnits;
    if(DEBUGGING_MODE) playerUnits = unitsAtPosition;
    else playerUnits = unitsAtPosition.filter(unit => unit.fraction === 'player');
    
    if (playerUnits.length > 1) {
      // Multiple player units - show selection modal
      state.setUiModal({
        type: 'unitSelection',
        data: {
          units: playerUnits,
          position: state.mousePosition || undefined
        }
      });
    } else if (playerUnits.length === 1) {
      // Single player unit - select it
      const unit = playerUnits[0];
      state.setSelectedUnit(unit);
      state.setSelectedUnitPosition(coord);
      const moveableGrids = state.movementCalculator.getMoveableGrids(coord, unit.movement, state.units);
      state.setMoveableGrids(moveableGrids);
    }
    // If no player units, do nothing (can't select enemy/ally units)
  }
};

export const onUnitMove = (
  coord: HexCoordinate,
  state: RendererState
) => {
  if (!state.selectedUnit) return;
  
  // Check if the target coordinate is in moveable grids
  const canMove = state.moveableGrids.some(grid => 
    grid.x === coord.x && grid.y === coord.y
  );

  if (!canMove) return;

  // Update unit position
  const updatedUnits = state.units.map(unit => {
    if (unit.id === state.selectedUnit!.id) {
      return {
        ...unit,
        position: coord,
        hasMoved: true
      };
    }
    return unit;
  });

  // Update state
  state.setUnits(updatedUnits);
  state.setSelectedUnit(null);
  state.setSelectedUnitPosition(null);
  state.setMoveableGrids([]);
};
