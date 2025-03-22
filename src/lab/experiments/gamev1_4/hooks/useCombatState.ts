import { useState } from 'react';
import { HexCoordinate } from '../types/HexCoordinate';
import { UnitData } from '../types/UnitData';
import { ShapeCalculator, ShapeConfig, ShapeType } from '../weapon/ShapeCalculator';
import weaponData from '../data/weapon-data.json';

interface UseCombatStateProps {
  onWeaponSelect?: (weaponId: string, selectionArea: HexCoordinate[]) => void;
  onCombatExecute?: (attacker: UnitData, weaponId: string, target: UnitData | HexCoordinate) => void;
  onCombatCancel?: () => void;
}

interface UseCombatStateReturn {
  // State
  selectedWeapon: string | null;
  selectionArea: HexCoordinate[];
  showWeaponPanel: boolean;
  
  // New state for effect preview
  effectPreviewArea: HexCoordinate[];
  
  // Actions
  handleWeaponSelect: (weaponId: string, position: HexCoordinate) => void;
  handleCombatAction: (coord: HexCoordinate, targetUnit: UnitData | undefined) => boolean;
  handleTargetHover: (coord: HexCoordinate | null) => void;
  resetCombatState: () => void;
  
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
  onCombatCancel
}: UseCombatStateProps = {}): UseCombatStateReturn => {
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [selectionArea, setSelectionArea] = useState<HexCoordinate[]>([]);
  const [showWeaponPanel, setShowWeaponPanel] = useState(false);
  
  // New state for effect preview
  const [effectPreviewArea, setEffectPreviewArea] = useState<HexCoordinate[]>([]);
  
  const shapeCalculator = new ShapeCalculator();

  const handleWeaponSelect = (weaponId: string, position: HexCoordinate) => {
    setSelectedWeapon(weaponId);
    setShowWeaponPanel(false); // Hide weapon panel after selection
    
    const weapon = weaponData[weaponId as keyof typeof weaponData];
    if (!weapon) {
      setSelectionArea([]);
      onWeaponSelect?.(weaponId, []);
      return;
    }

    // Get weapon config from weapon data
    const weaponConfig: ShapeConfig = {
      type: weapon.selectionType as ShapeType,
      minRange: weapon.minSelectionRange,
      maxRange: weapon.maxSelectionRange,
      minEffectRange: weapon.minEffectRange,
      maxEffectRange: weapon.maxEffectRange
    };
    
    const newSelectionArea = shapeCalculator.getSelectableArea(
      position,
      weaponConfig
    );
    
    setSelectionArea(newSelectionArea);
    onWeaponSelect?.(weaponId, newSelectionArea);
  };

  const handleCombatAction = (coord: HexCoordinate, targetUnit: UnitData | undefined): boolean => {
    if (!selectedWeapon) return false;

    // Check if the clicked coordinate is in the selection area
    const isValidTarget = selectionArea.some(pos => 
      pos.x === coord.x && pos.y === coord.y
    );

    if (isValidTarget) {
      const weapon = weaponData[selectedWeapon as keyof typeof weaponData];
      if (!weapon) return false;

      onCombatExecute?.(
        targetUnit!,
        selectedWeapon,
        targetUnit || coord
      );

      resetCombatState();
      return true;
    }

    return false;
  };

  const handleTargetHover = (coord: HexCoordinate | null) => {
    if (!selectedWeapon || !coord) {
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
      // Calculate effect area using the same shape calculator
      const effectConfig: ShapeConfig = {
        type: weapon.effectType as ShapeType,
        minRange: weapon.minEffectRange,
        maxRange: weapon.maxEffectRange,
        minEffectRange: 0,
        maxEffectRange: 0
      };
      const startTime = new Date();
      const newEffectArea = shapeCalculator.getSelectableArea(
        coord,
        effectConfig
      );
      const cost = new Date().getTime() - startTime.getTime();
      console.log('Computation time', cost);

      setEffectPreviewArea(newEffectArea);
    } else {
      setEffectPreviewArea([]);
    }
  };

  const resetCombatState = () => {
    setSelectedWeapon(null);
    setSelectionArea([]);
    setEffectPreviewArea([]);
    setShowWeaponPanel(false);
    onCombatCancel?.();
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