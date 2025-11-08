import React, { useState } from 'react';
import { HexCoordinate } from '../../game-versioning/types/HexCoordinate';
import { UnitData } from '../types/UnitData';
import { ShapeConfig } from '../weapon/ShapeCalculator';
import { EffectCalculator } from '../weapon/EffectCalculator';
import { SelectionCalculator } from '../weapon/SelectionCalculator';
import weaponData from '../data/weapon-data.json';

interface UseCombatStateProps {
  onWeaponSelect?: (weaponId: string, selectionArea: HexCoordinate[]) => void;
  onCombatExecute?: (attacker: UnitData, weaponId: string, target: UnitData | HexCoordinate) => void;
  onCombatCancel?: () => void;
  findUnitsAtPosition?: (coord: HexCoordinate) => UnitData[];
}

interface UseCombatStateReturn {
  // State
  selectedWeapon: string | null;
  selectionArea: HexCoordinate[];
  showWeaponPanel: boolean;
  
  // New state for effect preview
  effectPreviewArea: HexCoordinate[];
  
  // Actions
  handleWeaponSelect: (weaponId: string, position: HexCoordinate, unit: UnitData) => void;
  handleCombatAction: (coord: HexCoordinate, targetUnit: UnitData | undefined) => boolean;
  handleTargetHover: (coord: HexCoordinate | null) => void;
  resetCombatState: (shouldTriggerCancel?: boolean) => void;
  
  // Setters
  setShowWeaponPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Custom hook for managing combat state including weapon selection,
 * target selection, and combat execution
 */
export const useCombatState = ({
  onWeaponSelect,
  onCombatExecute,
  onCombatCancel,
  findUnitsAtPosition
}: UseCombatStateProps = {}): UseCombatStateReturn => {
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [selectionArea, setSelectionArea] = useState<HexCoordinate[]>([]);
  const [showWeaponPanel, setShowWeaponPanel] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);
  const [lastMovePosition, setLastMovePosition] = useState<HexCoordinate | null>(null);
  
  // New state for effect preview
  const [effectPreviewArea, setEffectPreviewArea] = useState<HexCoordinate[]>([]);
  
  const handleWeaponSelect = (weaponId: string, position: HexCoordinate, unit: UnitData) => {
    setSelectedWeapon(weaponId);
    setSelectedUnit(unit);
    setLastMovePosition(position);
    setShowWeaponPanel(false);
    
    const weapon = weaponData[weaponId as keyof typeof weaponData];
    if (!weapon) {
      setSelectionArea([]);
      onWeaponSelect?.(weaponId, []);
      return;
    }

    const weaponConfig: ShapeConfig = {
      type: weapon.selectionType as 'round' | 'line' | 'fan',
      minSelectRange: weapon.minSelectionRange,
      maxSelectRange: weapon.maxSelectionRange,
      minEffectRange: weapon.minEffectRange,
      maxEffectRange: weapon.maxEffectRange
    };
    
    const newSelectionArea = SelectionCalculator.getSelectionArea(
      position,
      weaponConfig
    );
    
    setSelectionArea(newSelectionArea);
    onWeaponSelect?.(weaponId, newSelectionArea);
  };

  const handleCombatAction = (coord: HexCoordinate, targetUnit: UnitData | undefined): boolean => {
    if (!selectedWeapon || !selectedUnit) return false;

    // Check if the clicked coordinate is in the selection area
    const isValidTarget = selectionArea.some(pos => 
      pos.x === coord.x && pos.y === coord.y
    );

    if (isValidTarget) {
      const weapon = weaponData[selectedWeapon as keyof typeof weaponData];
      if (!weapon) return false;

      // Calculate effect area and find affected units
      const effectConfig: ShapeConfig = {
        type: weapon.effectType.toLowerCase() as 'round' | 'line' | 'fan',
        minSelectRange: weapon.minSelectionRange,
        maxSelectRange: weapon.maxSelectionRange,
        minEffectRange: weapon.minEffectRange,
        maxEffectRange: weapon.maxEffectRange
      };

      const effectArea = EffectCalculator.getEffectArea(
        lastMovePosition || selectedUnit.position,
        coord, 
        effectConfig
      );

      // Use the provided findUnitsAtPosition function
      const affectedUnits: UnitData[] = [];
      effectArea.forEach(pos => {
        if (findUnitsAtPosition) {  // Only call if function is provided
          const unitsAtPosition = findUnitsAtPosition(pos);
          affectedUnits.push(...unitsAtPosition);
        }
      });

      // Log affected units and simulate combat calculations
      if (affectedUnits.length > 0) {
        console.log('Units affected by attack:', affectedUnits.map(unit => ({
          id: unit.id,
          fraction: unit.fraction,
          position: unit.position
        })));
        
        // Simulate combat calculations
        console.log('Calculating damage for each affected unit...');
        affectedUnits.forEach(unit => {
          console.log(`Would deal damage to unit ${unit.id} at position (${unit.position.x}, ${unit.position.y})`);
        });

        // Execute combat without showing action menu
        onCombatExecute?.(
          selectedUnit,
          selectedWeapon,
          targetUnit || coord
        );

        // Reset state without triggering cancel callback
        resetCombatState(false);
        return true;
      } else {
        // No units affected - provide feedback but maintain state
        console.log('No units affected by attack');
        console.log('Maintaining selection state for retry');
        // TODO: Play invalid sound effect
        return false;
      }
    }

    return false;
  };

  const handleTargetHover = (coord: HexCoordinate | null) => {
    if (!selectedWeapon || !selectedUnit || !coord) {
      setEffectPreviewArea([]);
      return;
    }

    const weapon = weaponData[selectedWeapon as keyof typeof weaponData];
    if (!weapon) {
      setEffectPreviewArea([]);
      return;
    }

    // Check if hovered coordinate is in selection area
    const isValidTarget = selectionArea.some(pos => 
      pos.x === coord.x && pos.y === coord.y
    );

    if (isValidTarget) {
      // Calculate effect area using EffectCalculator
      const effectConfig: ShapeConfig = {
        type: weapon.effectType.toLowerCase() as 'round' | 'line' | 'fan',
        minSelectRange: weapon.minSelectionRange,
        maxSelectRange: weapon.maxSelectionRange,
        minEffectRange: weapon.minEffectRange,
        maxEffectRange: weapon.maxEffectRange
      };

      const newEffectArea = EffectCalculator.getEffectArea(
        lastMovePosition || selectedUnit.position,
        coord, 
        effectConfig
      );

      setEffectPreviewArea(newEffectArea);
    } else {
      setEffectPreviewArea([]);
    }
  };

  const resetCombatState = (shouldTriggerCancel: boolean = true) => {
    setSelectedWeapon(null);
    setSelectedUnit(null);
    setSelectionArea([]);
    setEffectPreviewArea([]);
    setShowWeaponPanel(false);
    setLastMovePosition(null);
    if (shouldTriggerCancel) {
      onCombatCancel?.();
    }
  };

  return {
    selectedWeapon,
    selectionArea,
    showWeaponPanel,
    effectPreviewArea,
    handleWeaponSelect,
    handleCombatAction,
    handleTargetHover,
    resetCombatState,
    setShowWeaponPanel,
  };
}; 