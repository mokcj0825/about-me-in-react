import { HexCoordinate } from "../types/HexCoordinate";
import { UnitData } from "../types/UnitData";
import { UIModalState } from "../types/UIState";
import { MovementCalculator } from "../movement/MovementCalculator";

interface RendererState {
  units: UnitData[];
  setSelectedUnit: (unit: UnitData | null) => void;
  setSelectedUnitPosition: (pos: HexCoordinate | null) => void;
  setMoveableGrids: (grids: HexCoordinate[]) => void;
  setUiModal: (modal: UIModalState) => void;
  mousePosition: { x: number; y: number } | null;
  movementCalculator: MovementCalculator;
}

export const onUnitSelected = (
  coord: HexCoordinate,
  state: RendererState
) => {
  const unitsAtPosition = state.units.filter(unit => 
    unit.position.x === coord.x && unit.position.y === coord.y
  );

  if (unitsAtPosition.length > 0) {
    // Filter for player units only
    const playerUnits = unitsAtPosition.filter(unit => unit.faction === 'player');
    
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
