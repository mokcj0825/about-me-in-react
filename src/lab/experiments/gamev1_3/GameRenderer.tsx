import React, { useRef, useState, useEffect } from "react";
import { HexCoordinate, createHexCoordinate } from "./types/HexCoordinate";
import { UnitData, initialUnits } from "./types/UnitData";
import { HexCell } from "./components/HexaGrids/HexCell";
import { MovementCalculator } from "./movement/MovementCalculator";
import { GroundMovement } from "./movement/rules/GroundMovement";
import { AirMovement } from "./movement/rules/AirMovement";
import { StandardZOC } from "./zoc/rules/StandardZOC";
import mapData from './data/map-data.json'
import type { TerrainType } from './movement/types'
import { UnitInfoDisplay } from "./components/DisplayPanel/UnitInfoDisplay";
import { TerrainInfoDisplay } from './components/DisplayPanel/TerrainInfoDisplay';
import { UnitSelectionModal } from './components/DisplayPanel/UnitSelectionModal';
import { hasCharacteristic } from "./types/Characteristics";
import { TerrainDetailDisplay } from './components/DisplayPanel/TerrainDetailDisplay';
import { UIModalState } from './types/UIState';
import { ControlHints } from './components/DisplayPanel/ControlHints';
import { TurnDisplay } from './components/TurnDisplay';
import { TurnState } from './types/TurnState';
import { advanceTurn, DayNightCycle, handleFactionTurn, handlePhaseEvent, TurnPhase } from './systems/TurnSystem';
import { GameMenu } from './components/GameMenu/GameMenu';
import stageData from './data/stage-data.json';
import { getAnnouncementMessage, TurnAnnouncement } from './components/TurnAnnouncement';
import { ActionMenu } from './components/ActionMenu/ActionMenu';
import { onUnitSelected } from './events/RendererEvents';
import { initMovementCosts } from './movement/initMovementCosts';
import { initBuffs } from './buffs/initBuffs';


/**
 * Grid layout constants
 * @constant GRID
 */
const GRID = {
  WIDTH: 100,        // Width of each hex cell
  ROW_OFFSET: 50     // Horizontal offset for odd rows
};

/**
 * Main game board renderer component
 * Handles:
 * - Grid generation and layout
 * - Unit movement and selection
 * - Mouse interaction and scrolling
 * - Visual state management
 * 
 * @component
 */
export const GameRenderer: React.FC = () => {
  // Use map dimensions directly from map data
  const { width, height } = mapData;

  // State management for units and movement
  const [units, setUnits] = useState<UnitData[]>(initialUnits);
  const [moveableGrids, setMoveableGrids] = useState<HexCoordinate[]>([]);
  const [selectedUnitPosition, setSelectedUnitPosition] = useState<HexCoordinate | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);
  const [multipleUnits, setMultipleUnits] = useState<UnitData[] | null>(null);

  // Mouse and scroll state
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  // Refs for DOM elements and intervals
  const mapRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  // Scroll configuration
  const SCROLL_THRESHOLD = 100;  // Distance from edge to trigger scroll
  const SCROLL_SPEED = 15;       // Pixels per scroll tick
  const PADDING = 400;           // Padding around the game board

  // Movement system initialization
  const groundMovementCalculator = new MovementCalculator(
    new GroundMovement(),
    [new StandardZOC()]
  );

  const airMovementCalculator = new MovementCalculator(
    new AirMovement(),
    [] // Air units ignore ZOC
  );

  // Add state for hovered terrain
  const [hoveredTerrain, setHoveredTerrain] = useState<TerrainType | null>(null);

  // Replace separate modal states with single UI state
  const [uiModal, setUiModal] = useState<UIModalState>({ type: null });

  const [turnState, setTurnState] = useState<TurnState>({
    number: stageData.initialState.turnNumber,
    cycle: stageData.initialState.startCycle as DayNightCycle,
    phase: stageData.initialState.startPhase as TurnPhase
  });

  // Add state for game menu
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);

  const [announcement, setAnnouncement] = useState<string | null>(null);

  // Add new state near the top with other state declarations
  const [isAITurnActive, setIsAITurnActive] = useState(false);

  const [showActionMenu, setShowActionMenu] = useState<{ x: number; y: number } | null>(null);
  const [lastMovePosition, setLastMovePosition] = useState<HexCoordinate | null>(null);

  // Initialize movement costs once when component mounts
  useEffect(() => {
    initMovementCosts();
    initBuffs();
  }, []);

  /**
   * Finds a unit at a specific coordinate
   * @param {HexCoordinate} coord - Position to check
   * @returns {UnitData | undefined} Unit at position if found
   */
  const findUnitAtPosition = (coord: HexCoordinate): UnitData | undefined => {
    return units.find(unit => 
      unit.position.x === coord.x && unit.position.y === coord.y
    );
  };

  // Mouse movement tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mapRef.current) return;
      const rect = mapRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    const handleMouseLeave = () => {
      setMousePosition(null);
    };

    mapRef.current?.addEventListener('mousemove', handleMouseMove);
    mapRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      mapRef.current?.removeEventListener('mousemove', handleMouseMove);
      mapRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Edge scrolling
  useEffect(() => {
    if (!mousePosition || !mapRef.current) {
      if (scrollIntervalRef.current) {
        window.clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
      return;
    }

    const container = mapRef.current;
    const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();

    scrollIntervalRef.current = window.setInterval(() => {
      const scrollLeft = mousePosition.x < SCROLL_THRESHOLD ? -SCROLL_SPEED :
                        mousePosition.x > containerWidth - SCROLL_THRESHOLD ? SCROLL_SPEED : 0;
      
      const scrollTop = mousePosition.y < SCROLL_THRESHOLD ? -SCROLL_SPEED :
                       mousePosition.y > containerHeight - SCROLL_THRESHOLD ? SCROLL_SPEED : 0;

      if (scrollLeft) container.scrollLeft += scrollLeft;
      if (scrollTop) container.scrollTop += scrollTop;
    }, 16);

    return () => {
      if (scrollIntervalRef.current) {
        window.clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };
  }, [mousePosition]);

  // Initial scroll position
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.scrollLeft = PADDING;
      mapRef.current.scrollTop = PADDING;
    }
  }, []);

  const grid = generateGrid(width, height);

  // Create movement calculators based on unit type
  const getMovementCalculator = (unit: UnitData): MovementCalculator => {
    if (unit.movementType === 'flying') {
      return new MovementCalculator(new AirMovement(), []); // Air units ignore ZOC
    } else {
      return new MovementCalculator(new GroundMovement(), [new StandardZOC()]);
    }
  };

  const getMoveableGrids = (unit: UnitData): HexCoordinate[] => {
    const calculator = getMovementCalculator(unit);
    return calculator.getMoveableGrids(unit.position, unit.movement, units);
  };

  /**
   * Handles cell hover events
   * Shows moveable grids for any unit being hovered
   */
  const handleCellHover = (coord: HexCoordinate, isHovering: boolean, isUnit: boolean) => {
    setHoveredTerrain(mapData.terrain[coord.y][coord.x] as TerrainType);

    // If a unit is already selected, don't show hover movement range
    if (selectedUnit) return;

    if (isHovering && isUnit) {
      const unitsAtPosition = units.filter(unit => 
        unit.position.x === coord.x && unit.position.y === coord.y
      );

      if (unitsAtPosition.length > 1) {
        // For multiple units, don't show movement range
        setMoveableGrids([]);
        setMultipleUnits(unitsAtPosition);
      } else if (unitsAtPosition.length === 1) {
        const unit = unitsAtPosition[0];
        const moveableGrids = getMoveableGrids(unit);
        setMoveableGrids(moveableGrids);
        setMultipleUnits(null);
      }
    } else {
      setMoveableGrids([]);
      setMultipleUnits(null);
    }
  };

  const handleUnitMove = (unit: UnitData, newPosition: HexCoordinate) => {
    // Only allow movement if unit hasn't moved this turn
    if (unit.hasMoved) return;

    const updatedUnits = units.map(u => 
      u.id === unit.id 
        ? { ...u, position: newPosition }
        : u
    );
    
    setUnits(updatedUnits);
    setLastMovePosition(newPosition);
    
    // Show action menu at mouse position
    if (mousePosition && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const scrollLeft = mapRef.current.scrollLeft;
      const scrollTop = mapRef.current.scrollTop;
      
      setShowActionMenu({ 
        x: mousePosition.x + scrollLeft - rect.left,
        y: mousePosition.y + scrollTop - rect.top
      });
    }
  };

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
    setShowActionMenu(null);
    setLastMovePosition(null);
  };

  const handleCancelMove = () => {
    if (!selectedUnit || !lastMovePosition) return;

    // Revert the unit's position
    setUnits(prevUnits => prevUnits.map(u => 
      u.id === selectedUnit.id 
        ? { ...u, position: selectedUnitPosition! }
        : u
    ));
    
    setShowActionMenu(null);
    setLastMovePosition(null);
  };

  const handleCellClick = (coord: HexCoordinate, isRightClick: boolean = false) => {
    // Block all actions during AI turns
    if (isAITurnActive) return;

    // If any modal is shown, only handle closing actions
    if (uiModal.type) {
        if (isRightClick) {
            setUiModal({ type: null });
        }
        return;
    }

    // If action menu is shown, handle right-click as cancel
    if (showActionMenu && isRightClick) {
        handleCancelMove();
        return;
    }

    // Handle right-click to deselect unit
    if (isRightClick) {
        setSelectedUnit(null);
        setSelectedUnitPosition(null);
        setMoveableGrids([]);
        return;
    }

    // Handle unit movement if a unit is selected
    if (selectedUnit) {
        // Check if clicked position is in moveable grids
        const isValidMove = moveableGrids.some(grid => 
            grid.x === coord.x && grid.y === coord.y
        );

        if (isValidMove) {
            handleUnitMove(selectedUnit, coord);
            return;
        }
    }

    // Handle new unit selection
    const unitAtPosition = findUnitAtPosition(coord);
    if (unitAtPosition) {
        onUnitSelected(coord, {
            units,
            setUnits,
            selectedUnit,
            moveableGrids,
            setSelectedUnit,
            setSelectedUnitPosition,
            setMoveableGrids,
            setUiModal,
            mousePosition,
            movementCalculator: unitAtPosition.movementType === 'flying' ? 
                new MovementCalculator(new AirMovement(), []) : 
                new MovementCalculator(new GroundMovement(), [new StandardZOC()])
        });
    }
  };

  const isMoveableCell = (coord: HexCoordinate): boolean => {
    if (!selectedUnitPosition) return false;
    const unit = selectedUnit || findUnitAtPosition(selectedUnitPosition);
    if (!unit) return false;

    const isValidMove = moveableGrids.some(grid =>
      grid.x === coord.x && grid.y === coord.y
    );

    if (!isValidMove) return false;

    const unitsAtTarget = units.filter(u =>
      u.position.x === coord.x && u.position.y === coord.y
    );

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
   * Finds all units at a specific coordinate
   * @param {HexCoordinate} coord - Position to check
   * @returns {UnitData[]} Array of units at position
   */
  const findUnitsAtPosition = (coord: HexCoordinate): UnitData[] => {
    return units.filter(unit => 
      unit.position.x === coord.x && unit.position.y === coord.y
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) { // Only middle click for dragging
      e.preventDefault();
      setIsDragging(true);
      setStartDrag({ x: e.clientX - scrollPosition.x, y: e.clientY - scrollPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && mapRef.current) {
      const newX = e.clientX - startDrag.x;
      const newY = e.clientY - startDrag.y;
      mapRef.current.scrollLeft = -newX;
      mapRef.current.scrollTop = -newY;
      setScrollPosition({ x: -newX, y: -newY });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 1) { // Only respond to middle button release
      setIsDragging(false);
    }
  };

  // Handle wheel scrolling
  const handleWheel = (e: WheelEvent) => {
    if (mapRef.current) {
      e.preventDefault();
      mapRef.current.scrollLeft += e.deltaX;
      mapRef.current.scrollTop += e.deltaY;
      setScrollPosition({
        x: -mapRef.current.scrollLeft,
        y: -mapRef.current.scrollTop
      });
    }
  };

  useEffect(() => {
    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (mapElement) {
        mapElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const handleMouseLeave = (e: React.MouseEvent) => {
    handleMouseUp(e);
    setHoveredTerrain(null);
  };

  // Update keyboard handler to respect modal states
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isAITurnActive) return; // Block keyboard shortcuts during AI turns

      if (e.key.toLowerCase() === 't') {
        setUiModal(current => 
          current.type ? { type: null } : { 
            type: 'terrain', 
            data: { terrain: hoveredTerrain || undefined } 
          }
        );
      } else if (e.key === 'Escape') {
        if (uiModal.type) {
          setUiModal({ type: null });
        } else {
          setIsGameMenuOpen(current => !current);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hoveredTerrain, uiModal.type, isAITurnActive]);

  // Update effect to monitor turn state changes
  useEffect(() => {
    console.log('Turn state changed:', turnState);
    
    if (turnState.phase === 'ally' || turnState.phase === 'enemy') {
      setIsAITurnActive(true); // Lock player actions
      const message = getAnnouncementMessage(turnState);
      setAnnouncement(message);
      
      setTimeout(() => {
        if (turnState.phase === 'enemy' && turnState.cycle === 'day') {
          setUnits(units => {
            let updatedUnits = handlePhaseEvent(units, 'onDayEnd');
            return handlePhaseEvent(updatedUnits, 'onNightStart');
          });
        }
        setAnnouncement(null);
        setIsAITurnActive(false); // Unlock player actions
        setTurnState(prevTurn => advanceTurn(prevTurn));
      }, 1000);
    }
  }, [turnState]);

  const handleEndTurn = () => {
    if (turnState.cycle === 'day') {
      setTurnState(prevTurn => advanceTurn(prevTurn));
      setUnits(prevUnits => handleFactionTurn(prevUnits, 'player'));
    } else {
      // Night ends, day starts - immediate transition
      console.log('Transitioning: Night -> Day');
      setUnits(units => {
        let updatedUnits = handlePhaseEvent(units, 'onNightEnd');
        return handlePhaseEvent(updatedUnits, 'onDayStart');
      });
      setTurnState(prevTurn => advanceTurn(prevTurn));
      setUnits(prevUnits => 
        prevUnits.map(unit => ({ ...unit, hasMoved: false }))
      );
    }
    setIsGameMenuOpen(false);
  };

  // Add keyboard handler for turn advancement
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleEndTurn();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Apply initial day/night effects
  useEffect(() => {
    if (stageData.initialState.startCycle === 'day') {
      setUnits(units => handlePhaseEvent(units, 'onDayStart'));
    } else {
      setUnits(units => handlePhaseEvent(units, 'onNightStart'));
    }
  }, []); // Run once on component mount

  // Remove or modify the existing announcement effect
  useEffect(() => {
    const message = getAnnouncementMessage(turnState);
    if (message && turnState.phase === 'player') {  // Only handle player phase here
      setAnnouncement(message);
      setTimeout(() => setAnnouncement(null), 1100);
    }
  }, [turnState]);

  const handleUnitSelect = (unit: UnitData) => {
    console.log('Selected Unit Position:', unit.position);
    
    const calculator = getMovementCalculator(unit);
    const grids = calculator.getMoveableGrids(unit.position, unit.movement, units);
    
    console.log('Moveable Grids:', grids);
    
    setSelectedUnit(unit);
    setMoveableGrids(grids);
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
          setUiModal({ type: null });
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
            setIsGameMenuOpen(false);
          }}
          onClose={() => setIsGameMenuOpen(false)}
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
          onClose={() => setUiModal({ type: null })}
        />
      )}
      
      {uiModal.type === 'unitSelection' && uiModal.data?.units && uiModal.data?.position && (
        <UnitSelectionModal
          units={uiModal.data.units}
          position={uiModal.data.position}
          onSelect={(unit) => {
            setSelectedUnit(unit);
            setSelectedUnitPosition(unit.position);
            const moveableGrids = getMoveableGrids(unit);
            setMoveableGrids(moveableGrids);
            setUiModal({ type: null });
          }}
          onClose={() => setUiModal({ type: null })}
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
        padding: `${PADDING}px`,
        minWidth: `${width * GRID.WIDTH + GRID.ROW_OFFSET + (PADDING * 2)}px`,
        minHeight: `${height * GRID.WIDTH * 0.75 + (PADDING * 2)}px`,
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
            marginLeft: (height - 1 - index) % 2 === 0 ? `${GRID.ROW_OFFSET}px` : '0',
            marginTop: index === 0 ? '0' : '-25px',
          }}>
            {row.map((coord) => (
              <HexCell 
                key={`${coord.x},${coord.y}`} 
                coordinate={coord}
                units={findUnitsAtPosition(coord)}
                terrain={mapData.terrain[coord.y][coord.x] as TerrainType}
                isMoveable={isMoveableCell(coord)}
                onHover={(coord, isHovering, isUnit) => handleCellHover(coord, isHovering, isUnit)}
                onClick={handleCellClick}
                unitPosition={selectedUnitPosition}
                findUnitAtPosition={findUnitAtPosition}
                isSelected={selectedUnit !== null && 
                  coord.x === selectedUnitPosition?.x && 
                  coord.y === selectedUnitPosition?.y}
              />
            ))}
          </div>
        ))}
      </div>
      
      <ControlHints />
      {announcement && <TurnAnnouncement message={announcement} />}
      
      {showActionMenu && (
        <ActionMenu
          position={showActionMenu}
          onStandby={handleStandby}
          onCancel={handleCancelMove}
        />
      )}
    </div>
  );
};

const generateGrid = (width: number, height: number) => {
  const grid: HexCoordinate[][] = [];
  for (let y = height - 1; y >= 0; y--) {
    const row: HexCoordinate[] = [];
    for (let x = 0; x < width; x++) {
      row.push(createHexCoordinate(x, y));
    }
    grid.push(row);
  }
  return grid;
};