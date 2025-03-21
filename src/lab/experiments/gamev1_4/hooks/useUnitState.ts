import { useState } from 'react';
import { HexCoordinate } from '../types/HexCoordinate';
import { UnitData, initialUnits } from '../types/UnitData';
import { getMoveableGrids, MovementCalculator } from '../movement/MovementCalculator';
import { GroundMovement } from '../movement/rules/GroundMovement';
import { AirMovement } from '../movement/rules/AirMovement';
import { StandardZOC } from '../zoc/rules/StandardZOC';
import { hasCharacteristic } from '../types/Characteristics';

interface UseUnitStateProps {
  onUnitMoved?: (unit: UnitData, newPosition: HexCoordinate) => void;
  onStandby?: () => void;
}

interface UseUnitStateReturn {
  // State
  units: UnitData[];
  moveableGrids: HexCoordinate[];
  selectedUnitPosition: HexCoordinate | null;
  selectedUnit: UnitData | null;
  multipleUnits: UnitData[] | null;
  lastMovePosition: HexCoordinate | null;
  
  // Setters
  setUnits: React.Dispatch<React.SetStateAction<UnitData[]>>;
  setSelectedUnit: React.Dispatch<React.SetStateAction<UnitData | null>>;
  setSelectedUnitPosition: React.Dispatch<React.SetStateAction<HexCoordinate | null>>;
  setMoveableGrids: React.Dispatch<React.SetStateAction<HexCoordinate[]>>;
  setMultipleUnits: React.Dispatch<React.SetStateAction<UnitData[] | null>>;
  setLastMovePosition: React.Dispatch<React.SetStateAction<HexCoordinate | null>>;
  
  // Functions
  findUnitAtPosition: (coord: HexCoordinate) => UnitData | undefined;
  findUnitsAtPosition: (coord: HexCoordinate) => UnitData[];
  handleUnitMove: (unit: UnitData, newPosition: HexCoordinate) => void;
  isMoveableCell: (coord: HexCoordinate) => boolean;
  handleUnitSelection: (position: HexCoordinate) => void;
  calculateMoveableGrids: (unit: UnitData, position: HexCoordinate) => void;
  handleCancelMove: () => void;
  handleStandby: () => void;
}

/**
 * Custom hook for managing unit state and interactions
 * Handles unit selection, movement, and related calculations
 */
export const useUnitState = ({ onUnitMoved, onStandby }: UseUnitStateProps = {}): UseUnitStateReturn => {
  // Core unit state
  const [units, setUnits] = useState<UnitData[]>(initialUnits);
  const [moveableGrids, setMoveableGrids] = useState<HexCoordinate[]>([]);
  const [selectedUnitPosition, setSelectedUnitPosition] = useState<HexCoordinate | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);
  const [multipleUnits, setMultipleUnits] = useState<UnitData[] | null>(null);
  const [lastMovePosition, setLastMovePosition] = useState<HexCoordinate | null>(null);

  /**
   * Finds a unit at a specific coordinate
   */
  const findUnitAtPosition = (coord: HexCoordinate): UnitData | undefined => {
    return units.find(unit => 
      unit.position.x === coord.x && unit.position.y === coord.y
    );
  };

  /**
   * Finds all units at a specific coordinate
   */
  const findUnitsAtPosition = (coord: HexCoordinate): UnitData[] => {
    return units.filter(unit => 
      unit.position.x === coord.x && unit.position.y === coord.y
    );
  };

  /**
   * Handles unit movement to a new position
   */
  const handleUnitMove = (unit: UnitData, newPosition: HexCoordinate) => {
    if (unit.hasMoved) return;

    const updatedUnits = units.map(u => 
      u.id === unit.id 
        ? { ...u, position: newPosition }
        : u
    );
    
    setUnits(updatedUnits);
    setLastMovePosition(newPosition);
    
    onUnitMoved?.(unit, newPosition);
  };

  /**
   * Checks if a cell is valid for movement
   */
  const isMoveableCell = (coord: HexCoordinate): boolean => {
    if (!selectedUnitPosition) return false;
    const unit = selectedUnit || findUnitAtPosition(selectedUnitPosition);
    if (!unit) return false;

    const isValidMove = moveableGrids.some(grid =>
      grid.x === coord.x && grid.y === coord.y
    );

    if (!isValidMove) return false;

    const unitsAtTarget = findUnitsAtPosition(coord);

    if (unitsAtTarget.length === 0) return true;

    const isMovingUnitFlying = hasCharacteristic(
      unit.characteristics,
      unit.buffs || [],
      'flying'
    );

    const hasTargetFlying = unitsAtTarget.some(u =>
      hasCharacteristic(u.characteristics, u.buffs || [], 'flying')
    );

    return isMovingUnitFlying ? !hasTargetFlying : unitsAtTarget.every(u =>
      hasCharacteristic(u.characteristics, u.buffs || [], 'flying')
    );
  };

  /**
   * Handles unit selection at a position
   */
  const handleUnitSelection = (position: HexCoordinate) => {
    const unit = findUnitAtPosition(position);
    if (!unit) return;

    setSelectedUnit(unit);
    setSelectedUnitPosition(position);
    calculateMoveableGrids(unit, position);
  };

  /**
   * Calculates moveable grids for a unit
   */
  const calculateMoveableGrids = (unit: UnitData, position: HexCoordinate) => {
    const movementCalculator = new MovementCalculator(
      unit.movementType === 'flying' ? new AirMovement() : new GroundMovement(),
      unit.movementType === 'flying' ? [] : [new StandardZOC()]
    );
    
    const moveableGrids = getMoveableGrids(unit, units);
    setMoveableGrids(moveableGrids);
  };

  /**
   * Handles canceling a unit's move
   */
  const handleCancelMove = () => {
    if (!selectedUnit || !lastMovePosition || !selectedUnitPosition) return;

    setUnits(prevUnits => prevUnits.map(u => 
      u.id === selectedUnit.id 
        ? { ...u, position: selectedUnitPosition }
        : u
    ));
    
    setLastMovePosition(null);
  };

  /**
   * Handles unit standby action
   */
  const handleStandby = () => {
    if (!selectedUnit || !lastMovePosition) return;
    
    setUnits(prevUnits => prevUnits.map(u => 
      u.id === selectedUnit.id 
        ? { ...u, hasMoved: true }
        : u
    ));
    
    setSelectedUnit(null);
    setSelectedUnitPosition(null);
    setMoveableGrids([]);
    setLastMovePosition(null);
    
    onStandby?.();
  };

  return {
    // State
    units,
    moveableGrids,
    selectedUnitPosition,
    selectedUnit,
    multipleUnits,
    lastMovePosition,
    
    // Setters
    setUnits,
    setSelectedUnit,
    setSelectedUnitPosition,
    setMoveableGrids,
    setMultipleUnits,
    setLastMovePosition,
    
    // Functions
    findUnitAtPosition,
    findUnitsAtPosition,
    handleUnitMove,
    isMoveableCell,
    handleUnitSelection,
    calculateMoveableGrids,
    handleCancelMove,
    handleStandby,
  };
}; 