import React, { useState, useEffect } from "react";
import { HexCoordinate } from "./types/HexCoordinate";
import { getMoveableGrids } from "./movement/MovementCalculator";
import mapData from './data/map-data.json'
import type { TerrainType } from './movement/types'
import { UnitInfoDisplay } from "./components/DisplayPanel/UnitInfoDisplay";
import { TerrainInfoDisplay } from './components/DisplayPanel/TerrainInfoDisplay';
import { UnitSelectionModal } from './components/DisplayPanel/UnitSelectionModal';
import { TerrainDetailDisplay } from './components/DisplayPanel/TerrainDetailDisplay';
import { ControlHints } from './components/DisplayPanel/ControlHints';
import { TurnDisplay } from './components/TurnDisplay';
import { handlePhaseEvent } from './systems/TurnSystem';
import { GameMenu } from './components/GameMenu/GameMenu';
import stageData from './data/stage-data.json';
import { TurnAnnouncement } from './components/TurnAnnouncement';
import { ActionMenu } from './components/ActionMenu/ActionMenu';
import { initMovementCosts } from './movement/initMovementCosts';
import { initBuffs } from './buffs/initBuffs';
import { DEBUGGING_MODE } from "./config";
import { WeaponSelectionPanel } from './components/DisplayPanel/WeaponSelectionPanel';
import { GameActionState } from './types/GameState';
import { generateGrid } from "./rendererUtils/GenerateGrid";
import { GridLayout } from "./constants/GridLayout";
import { ScrollConfig } from "./constants/ScrollConfig";
import { GridRenderer } from './components/Renderer/GridRenderer';
import { useUnitState } from './hooks/useUnitState';
import { useMapInteraction } from './hooks/useMapInteraction';
import { useCombatState } from './hooks/useCombatState';
import { useTurnSystem } from './hooks/useTurnSystem';
import { useUIState } from './hooks/useUIState';

/**
 * Main game board renderer component
 * 
 * TODO: Break down into smaller components and hooks:
 * 
 * Custom Hooks:
 * - ✓ useUnitState: unit selection, movement, and management
 * - ✓ useMapInteraction: mouse, wheel, and scroll handling
 * - ✓ useCombatState: weapon selection and combat management
 * - ✓ useTurnSystem: turn management, phase changes
 * - ✓ useUIState: modals, menus, announcements
 * 
 * Components to Extract:
 * - MapContainer: handle the main map div and its events
 * - UIOverlay: manage all UI elements (menus, modals, announcements)
 * - CombatUI: weapon selection and combat-related UI
 * 
 * Utility Files:
 * - unitMovementHandlers.ts: unit movement logic
 * - actionHandlers.ts: game action handlers
 * - gridUtils.ts: grid-related calculations
 * 
 * @component
 */
export const GameRenderer: React.FC = () => {
  const { width, height } = mapData;

  const {
    units,
    moveableGrids,
    selectedUnitPosition,
    selectedUnit,
    multipleUnits,
    lastMovePosition,
    setUnits,
    setSelectedUnit,
    setSelectedUnitPosition,
    setMoveableGrids,
    setMultipleUnits,
    setLastMovePosition,
    findUnitAtPosition,
    findUnitsAtPosition,
    handleUnitMove,
    isMoveableCell,
    handleUnitSelection,
    calculateMoveableGrids,
    handleCancelMove,
    handleStandby,
  } = useUnitState({
    onUnitMoved: (unit, newPosition) => {
      // Show action menu at mouse position
      if (mousePosition && mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        const scrollLeft = mapRef.current.scrollLeft;
        const scrollTop = mapRef.current.scrollTop;
        
        handleActionMenuShow({ 
          x: mousePosition.x + scrollLeft - rect.left,
          y: mousePosition.y + scrollTop - rect.top
        });
      }
    },
    onStandby: () => {
      setActionState('idle');
      handleActionMenuHide();
    }
  });

  const {
    mousePosition,
    scrollPosition,
    isDragging,
    mapRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } = useMapInteraction({
    onMousePositionChange: (position) => {
      // Update hover states when mouse position changes
      if (!position) {
        handleTerrainHover(null, null);
      }
    }
  });

  const {
    selectedWeapon,
    selectionArea,
    showWeaponPanel,
    effectPreviewArea,
    handleWeaponSelect,
    handleCombatAction,
    handleTargetHover,
    resetCombatState,
    setShowWeaponPanel
  } = useCombatState({
    onWeaponSelect: (weaponId, area) => {
      setActionState('targetSelection');
    },
    onCombatExecute: (attacker, weaponId, target) => {
      // Mark the unit as moved
      setUnits(prevUnits => prevUnits.map(u => 
        u.id === selectedUnit?.id 
          ? { ...u, hasMoved: true }
          : u
      ));
      
      // Reset selection
      setSelectedUnit(null);
      setSelectedUnitPosition(null);
      setMoveableGrids([]);
      setLastMovePosition(null);
      
      setActionState('idle');
    },
    onCombatCancel: () => {
      // Return to action menu state
      setActionState('unitMoved');
      if (mousePosition && mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        const scrollLeft = mapRef.current.scrollLeft;
        const scrollTop = mapRef.current.scrollTop;
        
        handleActionMenuShow({ 
          x: mousePosition.x + scrollLeft - rect.left,
          y: mousePosition.y + scrollTop - rect.top
        });
      }
    }
  });

  const {
    turnState,
    isAITurnActive,
    handleEndTurn,
    setTurnState
  } = useTurnSystem({
    onUnitsUpdate: (updater) => {
      setUnits(updater);
    },
    onAITurnStart: () => {
      // Block user interactions during AI turns
      setActionState('aiTurn');
    },
    onAITurnEnd: () => {
      // Re-enable user interactions
      setActionState('idle');
    },
    onAnnouncementChange: (message) => {
      setAnnouncement(message);
    }
  });

  const {
    hoveredTerrain,
    hoveredCoord,
    uiModal,
    isGameMenuOpen,
    announcement,
    showActionMenu,
    handleTerrainHover,
    handleModalToggle,
    handleMenuToggle,
    handleActionMenuShow,
    handleActionMenuHide,
    setAnnouncement
  } = useUIState({
    onModalClose: () => {
      if (multipleUnits) {
        setMultipleUnits(null);
      }
    }
  });

  // Replace multiple state booleans with single action state
  const [actionState, setActionState] = useState<GameActionState>('idle');

  // Game initialization effects
  useEffect(() => {
    // Initialize game systems
    initMovementCosts();
    initBuffs();

    // Set initial scroll position
    if (mapRef.current) {
      mapRef.current.scrollLeft = ScrollConfig.PADDING;
      mapRef.current.scrollTop = ScrollConfig.PADDING;
    }

    // Apply initial day/night effects
    if (stageData.initialState.startCycle === 'day') {
      setUnits(units => handlePhaseEvent(units, 'onDayStart'));
    } else {
      setUnits(units => handlePhaseEvent(units, 'onNightStart'));
    }
  }, []); // All initialization effects run once on mount

  // #region MapContainer component
  const renderGrid = () => {
    // ... existing code ...
  };

  const renderUnits = () => {
    // ... existing code ...
  };
  // #endregion

  // #region UIOverlay component
  const renderUI = () => {
    return (
      <>
        {/* ... existing UI elements ... */}
      </>
    );
  };
  // #endregion

  const grid = generateGrid(width, height);

  /**
   * Handles cell hover events
   * Shows moveable grids for any unit being hovered
   */
  const handleCellHover = (coord: HexCoordinate, isHovering: boolean, isUnit: boolean) => {
    handleTerrainHover(
      isHovering ? mapData.terrain[coord.y][coord.x] as TerrainType : null,
      isHovering ? coord : null
    );

    // Handle effect preview during combat
    if (actionState === 'targetSelection') {
      handleTargetHover(isHovering ? coord : null);
      return;
    }

    // If a unit is already selected, don't show hover movement range
    if (selectedUnit) return;

    if (isHovering && isUnit) {
      const unitsAtPosition = findUnitsAtPosition(coord);

      if (unitsAtPosition.length > 1) {
        // For multiple units, don't show movement range
        setMoveableGrids([]);
        setMultipleUnits(unitsAtPosition);
      } else if (unitsAtPosition.length === 1) {
        const unit = unitsAtPosition[0];
        calculateMoveableGrids(unit, coord);
        setMultipleUnits(null);
      }
    } else {
      setMoveableGrids([]);
      setMultipleUnits(null);
    }
  };

  const handleCellClick = (coord: HexCoordinate, isRightClick: boolean = false) => {
    // Block all actions during AI turns
    if (actionState === 'aiTurn' && !DEBUGGING_MODE) return;

    // If any modal is shown, only handle closing actions
    if (uiModal.type) {
      if (isRightClick) {
        handleModalToggle(null);
      }
      return;
    }

    // Handle right-click based on current state
    if (isRightClick) {
      switch (actionState) {
        case 'targetSelection':
          resetCombatState();
          return;
        case 'weaponSelection':
          setActionState('unitMoved');
          resetCombatState();
          if (mousePosition && mapRef.current) {
            const rect = mapRef.current.getBoundingClientRect();
            const scrollLeft = mapRef.current.scrollLeft;
            const scrollTop = mapRef.current.scrollTop;
            
            handleActionMenuShow({ 
              x: mousePosition.x + scrollLeft - rect.left,
              y: mousePosition.y + scrollTop - rect.top
            });
          }
          return;
        case 'unitMoved':
          handleCancelMove();
          setActionState('unitSelected');
          handleActionMenuHide();
          return;
        case 'unitSelected':
          setSelectedUnit(null);
          setSelectedUnitPosition(null);
          setMoveableGrids([]);
          setActionState('idle');
          handleActionMenuHide();
          return;
      }
      return;
    }

    // Handle left-click based on current state
    switch (actionState) {
      case 'idle':
        const unitAtPosition = findUnitAtPosition(coord);
        if (unitAtPosition) {
          handleUnitSelection(coord);
          setActionState('unitSelected');
        }
        break;

      case 'unitSelected':
        if (isMoveableCell(coord)) {
          handleUnitMove(selectedUnit!, coord);
          setActionState('unitMoved');
        }
        break;

      case 'targetSelection':
        const targetUnit = findUnitAtPosition(coord);
        if (handleCombatAction(coord, targetUnit)) {
          setActionState('idle');
        }
        break;
    }
  };

  // Combined keyboard handlers
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Block keyboard shortcuts during AI turns
      if (isAITurnActive && !DEBUGGING_MODE) return;

      switch (e.key) {
        case 'Enter':
          handleEndTurn();
          break;
        case 't':
        case 'T':
          handleModalToggle('terrain', { terrain: hoveredTerrain });
          break;
        case 'Escape':
          if (uiModal.type) {
            handleModalToggle(uiModal.type);
          } else {
            handleMenuToggle();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hoveredTerrain, uiModal.type, isAITurnActive, handleEndTurn]);

  // Replace the renderHex function with this simpler version
  const renderHex = (coord: HexCoordinate) => {
    return (
      <GridRenderer
        coord={coord}
        units={findUnitsAtPosition(coord)}
        terrain={mapData.terrain[coord.y][coord.x] as TerrainType}
        isMoveable={!selectedWeapon && isMoveableCell(coord)}
        selectedUnitPosition={selectedUnitPosition}
        selectedUnit={selectedUnit}
        findUnitAtPosition={findUnitAtPosition}
        selectionArea={selectionArea}
        effectPreviewArea={effectPreviewArea}
        onHover={(coord, isHovering, isUnit) => handleCellHover(coord, isHovering, isUnit)}
        onClick={handleCellClick}
      />
    );
  };

  const handleAttackAction = () => {
    setShowWeaponPanel(true);
    setActionState('weaponSelection');
    handleActionMenuHide();
  };

  return (
    <div 
      ref={mapRef} 
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'auto',
        position: 'relative',
        backgroundColor: '#FFE4C4',  // Keep the background color
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(e) => {
        e.preventDefault();
        if (multipleUnits) {
          setMultipleUnits(null);
          handleModalToggle(null);
        }
      }}
    >
      <TurnDisplay 
        turn={turnState}
      />
      
      {isGameMenuOpen && (
        <GameMenu
          turn={turnState}
          onEndTurn={() => {
            handleEndTurn();
            handleMenuToggle();
          }}
          onClose={handleMenuToggle}
        />
      )}
      
      {/* ONLY show UnitInfoDisplay for selected unit */}
      {selectedUnit && !multipleUnits && mousePosition && (
        <UnitInfoDisplay
          unit={selectedUnit}
          mousePosition={mousePosition}
        />
      )}
      
      {/* Terrain hover display */}
      {hoveredTerrain && mousePosition && (
        <TerrainInfoDisplay
          terrain={hoveredTerrain}
          mousePosition={mousePosition}
        />
      )}
      
      {uiModal.type === 'terrain' && uiModal.data?.terrain && (
        <TerrainDetailDisplay
          visible={true}
          terrain={uiModal.data.terrain}
          onClose={() => handleModalToggle(null)}
        />
      )}
      
      {uiModal.type === 'unitSelection' && uiModal.data?.units && uiModal.data?.position && (
        <UnitSelectionModal
          units={uiModal.data.units}
          position={uiModal.data.position}
          onSelect={(unit) => {
            setSelectedUnit(unit);
            setSelectedUnitPosition(unit.position);
            setMoveableGrids(getMoveableGrids(unit, units));
            handleModalToggle(null);
          }}
          onClose={() => handleModalToggle(null)}
        />
      )}
      
      {/* Show unit info for multiple units */}
      {multipleUnits && mousePosition && (
        <UnitInfoDisplay
          units={multipleUnits}
          mousePosition={mousePosition}
          isMultiple={true}
        />
      )}
      
      <div style={{
        padding: `${ScrollConfig.PADDING}px`,
        minWidth: `${width * GridLayout.WIDTH + GridLayout.ROW_OFFSET + (ScrollConfig.PADDING * 2)}px`,
        minHeight: `${height * GridLayout.WIDTH * 0.75 + (ScrollConfig.PADDING * 2)}px`,
        margin: 0,
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
      }}>
        {grid.map((row, index) => (
          <div key={index} style={{
            display: 'flex',
            margin: 0,
            padding: 0,
            lineHeight: 0,
            fontSize: 0,
            whiteSpace: 'nowrap',
            marginLeft: (height - 1 - index) % 2 === 0 ? `${GridLayout.ROW_OFFSET}px` : '0',
            marginTop: index === 0 ? '0' : '-25px',
          }}>
            {row.map((coord) => renderHex(coord))}
          </div>
        ))}
      </div>
      
      <ControlHints hoveredCoord={hoveredCoord} />
      {announcement && <TurnAnnouncement message={announcement} />}
      
      {showActionMenu && (
        <ActionMenu
          position={showActionMenu}
          onStandby={handleStandby}
          onCancel={handleCancelMove}
          onAttack={handleAttackAction}
        />
      )}

      {showWeaponPanel && selectedUnit && (
        <WeaponSelectionPanel
          unit={selectedUnit}
          onWeaponSelect={(weaponId) => handleWeaponSelect(weaponId, lastMovePosition || selectedUnit.position)}
          onClose={() => {
            setActionState('idle');
            resetCombatState();
          }}
          style={{
            position: 'absolute',
            top: `${selectedUnit.position.y * GridLayout.WIDTH * 0.75 + ScrollConfig.PADDING}px`,
            left: `${selectedUnit.position.x * GridLayout.WIDTH + (selectedUnit.position.y % 2 === 0 ? GridLayout.ROW_OFFSET : 0) + ScrollConfig.PADDING}px`
          }}
        />
      )}
    </div>
  );
};
