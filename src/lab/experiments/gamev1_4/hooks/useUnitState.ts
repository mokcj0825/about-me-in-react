import React, { useState } from 'react';
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
    
    // Always trigger onUnitMoved, even for same position
    onUnitMoved?.(unit, newPosition);
  };

  /**
   * Checks if a cell is valid for movement
   */
  const isMoveableCell = (coord: HexCoordinate): boolean => {
    if (!selectedUnitPosition) return false;
    const unit = selectedUnit || findUnitAtPosition(selectedUnitPosition);
    if (!unit) return false;

    // Check if this is the current position
    const isCurrentPosition = coord.x === unit.position.x && coord.y === unit.position.y;
    
    // Always allow current position if stacking rules permit
    if (isCurrentPosition) {
      const unitsAtPosition = findUnitsAtPosition(coord).filter(u => u.id !== unit.id);
      return unitsAtPosition.length === 0 || unitsAtPosition.every(u => 
        // First check if they're allies
        ((u.faction === 'player' && unit.faction === 'player') ||
         (u.faction === 'ally' && (unit.faction === 'player' || unit.faction === 'ally')) ||
         (u.faction === 'player' && unit.faction === 'ally')) &&
        // Then check movement type compatibility
        ((unit.movementType === 'flying' && u.movementType !== 'flying') || 
         (unit.movementType !== 'flying' && u.movementType === 'flying'))
      );
    }

    const isValidMove = moveableGrids.some(grid =>
      grid.x === coord.x && grid.y === coord.y
    );

    if (!isValidMove) return false;

    const unitsAtTarget = findUnitsAtPosition(coord);

    if (unitsAtTarget.length === 0) return true;

    // Check faction compatibility first
    const areAlliesAtTarget = unitsAtTarget.every(u =>
      (u.faction === 'player' && unit.faction === 'player') ||
      (u.faction === 'ally' && (unit.faction === 'player' || unit.faction === 'ally')) ||
      (u.faction === 'player' && unit.faction === 'ally')
    );

    if (!areAlliesAtTarget) return false;

    // Then check movement type compatibility
    const isMovingUnitFlying = unit.movementType === 'flying';
    return unitsAtTarget.every(u => 
      (isMovingUnitFlying && u.movementType !== 'flying') || 
      (!isMovingUnitFlying && u.movementType === 'flying')
    );
  };

  /**
   * Handles unit selection at a position
   */
  const handleUnitSelection = (position: HexCoordinate) => {
    const unitsAtPosition = findUnitsAtPosition(position);
    if (unitsAtPosition.length === 0) return;

    // If there are multiple units at the position, show selection modal
    if (unitsAtPosition.length > 1) {
      setMultipleUnits(unitsAtPosition);
      return;
    }

    // If only one unit, select it directly
    const unit = unitsAtPosition[0];
    if (!unit) return;

    // Only proceed with selection if it's a player/ally unit that hasn't moved
    if (unit.hasMoved || (unit.faction !== 'player' && unit.faction !== 'ally')) return;

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
    
    // Get all moveable grids including the current position if valid
    const moveableGrids = movementCalculator.getMoveableGrids(position, unit.movement, units);

    // Ensure the current position is included if stacking rules allow it
    const unitsAtCurrentPos = units.filter(u => 
      u.position.x === position.x && 
      u.position.y === position.y && 
      u.id !== unit.id
    );

    const canStayAtCurrentPos = unitsAtCurrentPos.length === 0 || unitsAtCurrentPos.every(u => 
      (unit.movementType === 'flying' && u.movementType !== 'flying') || 
      (unit.movementType !== 'flying' && u.movementType === 'flying')
    );

    const isCurrentPosIncluded = moveableGrids.some(grid => 
      grid.x === position.x && grid.y === position.y
    );

    if (canStayAtCurrentPos && !isCurrentPosIncluded) {
      moveableGrids.push({ ...position });
    }
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