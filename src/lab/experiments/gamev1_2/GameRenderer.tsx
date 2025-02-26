import React, { useRef, useState, useEffect } from "react";
import { HexCoordinate, createHexCoordinate } from "./types/HexCoordinate";
import { UnitData, initialUnits } from "./types/UnitData";
import { HexCell } from "./components/HexaGrids/HexCell";
import { MovementCalculator } from "./movement/MovementCalculator";
import { GroundMovement } from "./movement/rules/GroundMovement";
import { StandardZOC } from "./zoc/rules/StandardZOC";
import mapData from './data/map-data.json'
import type { TerrainType } from './movement/types'
import { UnitInfoDisplay } from "./components/DisplayPanel/UnitInfoDisplay";
import { TerrainInfoDisplay } from './components/DisplayPanel/TerrainInfoDisplay';
import { UnitSelectionModal } from './components/DisplayPanel/UnitSelectionModal';
import { hasCharacteristic } from "./types/Characteristics";

/**
 * Props for the GameRenderer component
 * @interface GameRendererProps
 * @property {number} width - Number of hexes in horizontal direction
 * @property {number} height - Number of hexes in vertical direction
 */
interface GameRendererProps {
  width: number;
  height: number;
}

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
 * @param {GameRendererProps} props
 */
export const GameRenderer: React.FC<GameRendererProps> = ({ width, height }) => {
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
  const movementCalculator = new MovementCalculator(
    new GroundMovement(),
    [new StandardZOC()]
  );

  // Add state for hovered terrain
  const [hoveredTerrain, setHoveredTerrain] = useState<TerrainType | null>(null);

  // Add state for modal position
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number } | null>(null);

  /**
   * Generates the hex grid layout
   * @returns {HexCoordinate[][]} 2D array of hex coordinates
   */
  const generateGrid = () => {
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

  const grid = generateGrid();

  // Main function
  const getMoveableGrids = (startCoord: HexCoordinate, movement: number): HexCoordinate[] => {
    return movementCalculator.getMoveableGrids(startCoord, movement, units);
  };

  /**
   * Handles cell hover events
   * Updates the hovered terrain state only
   */
  const handleCellHover = (coord: HexCoordinate) => {
    // ONLY handle terrain hover, remove any unit-related hover logic
    setHoveredTerrain(mapData.terrain[coord.y][coord.x] as TerrainType);
  };

  const handleCellClick = (coord: HexCoordinate, isRightClick: boolean = false) => {
    // Handle right click - deselect current unit
    if (isRightClick) {
      setSelectedUnit(null);
      setSelectedUnitPosition(null);
      setMoveableGrids([]);
      return;
    }

    // If we have a selected unit and this is a valid move, handle movement first
    if (selectedUnit && moveableGrids.length > 0 && isMoveableCell(coord)) {
      const updatedUnits = units.map(unit => 
        unit.id === selectedUnit.id 
          ? { ...unit, position: coord }
          : unit
      );
      setUnits(updatedUnits);
      setSelectedUnit(null);
      setSelectedUnitPosition(null);
      setMoveableGrids([]);
      return;
    }

    // Handle unit selection
    const unitsAtPosition = units.filter(unit => 
      unit.position.x === coord.x && unit.position.y === coord.y
    );

    if (unitsAtPosition.length > 1) {
      // For multiple units, show selection modal first
      setMultipleUnits(unitsAtPosition);
      setModalPosition(mousePosition);
      // Don't set selectedUnit yet - wait for modal selection
    } else if (unitsAtPosition.length === 1) {
      // For single unit, select immediately
      const unit = unitsAtPosition[0];
      setSelectedUnit(unit);
      setSelectedUnitPosition(coord);
      const moveableGrids = getMoveableGrids(coord, unit.movement);
      setMoveableGrids(moveableGrids);
    }
  };

  const handleUnitSelect = (unit: UnitData) => {
    setSelectedUnit(unit);
    setSelectedUnitPosition(unit.position);
    setMultipleUnits(null);
    const moveableGrids = getMoveableGrids(unit.position, unit.movement);
    setMoveableGrids(moveableGrids);
  };

  const isMoveableCell = (coord: HexCoordinate): boolean => {
    if (!selectedUnitPosition) return false;
    const unit = selectedUnit || findUnitAtPosition(selectedUnitPosition);
    if (!unit) return false;
    
    // Check if this is a valid movement coordinate
    const isValidMove = moveableGrids.some(grid => 
      grid.x === coord.x && grid.y === coord.y
    );
    
    if (!isValidMove) return false;

    // Get units at target position
    const unitsAtTarget = units.filter(u => 
      u.position.x === coord.x && u.position.y === coord.y
    );

    // Debug logs for movement checks
    console.log('Moving unit:', {
      name: unit.name,
      characteristics: unit.characteristics,
      buffs: unit.buffs,
      isFlying: hasCharacteristic(unit.characteristics, unit.buffs || [], 'flying')
    });

    if (unitsAtTarget.length > 0) {
      console.log('Target units:', unitsAtTarget.map(u => ({
        name: u.name,
        characteristics: u.characteristics,
        buffs: u.buffs,
        isFlying: hasCharacteristic(u.characteristics, u.buffs || [], 'flying')
      })));
    }

    // If no units at target, movement is allowed
    if (unitsAtTarget.length === 0) return true;

    // Check if moving unit is flying
    const isMovingUnitFlying = hasCharacteristic(
      unit.characteristics,
      unit.buffs || [],
      'flying'
    );

    // Check if any target unit is flying
    const hasTargetFlying = unitsAtTarget.some(u => 
      hasCharacteristic(u.characteristics, u.buffs || [], 'flying')
    );

    // Allow stacking if:
    // 1. Moving unit is flying and NO target units are flying
    // 2. Moving unit is not flying and ALL target units are flying
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

  return (
    <div 
      ref={mapRef} 
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'auto',
        position: 'relative',
        backgroundColor: '#FFE4C4', // Changed from #e0e0e0 to our background color
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(e) => e.preventDefault()}
    >
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
      
      {multipleUnits && modalPosition && (
        <UnitSelectionModal
          units={multipleUnits}
          position={modalPosition}
          onSelect={handleUnitSelect}
          onClose={() => {
            setMultipleUnits(null);
            setModalPosition(null);
          }}
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
                onHover={handleCellHover}
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
    </div>
  );
}; 