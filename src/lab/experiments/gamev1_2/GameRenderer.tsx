import React, { useRef, useState, useEffect } from "react";
import { HexCoordinate, createHexCoordinate, getNeighbors, getZoneOfControl } from "./types/HexCoordinate";
import { UnitData, initialUnits } from "./types/UnitData";
import { HexCell } from "./components/HexCell";
import { hasCharacteristic } from './types/Characteristics';
import { MovementCalculator } from "./movement/MovementCalculator";
import { GroundMovement } from "./movement/rules/GroundMovement";
import { StandardZOC } from "./zoc/rules/StandardZOC";
import mapData from './data/map-data.json'
import type { TerrainType } from './movement/types'


// Types
interface GameRendererProps {
  width: number;
  height: number;
}

// Grid constants
const GRID = {
  WIDTH: 100,
  ROW_OFFSET: 50
};

// Main Renderer Component
export const GameRenderer: React.FC<GameRendererProps> = ({ width, height }) => {
  const [units, setUnits] = useState<UnitData[]>(initialUnits);
  const [moveableGrids, setMoveableGrids] = useState<HexCoordinate[]>([]);
  const [selectedUnitPosition, setSelectedUnitPosition] = useState<HexCoordinate | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);

  const SCROLL_THRESHOLD = 100;
  const SCROLL_SPEED = 15;
  const PADDING = 400;

  const movementCalculator = new MovementCalculator(
    new GroundMovement(),
    [new StandardZOC()]
  );

  // Grid generation with cube coordinates
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

  // Helper functions
  const isHostileUnit = (movingUnit: UnitData, targetUnit: UnitData): boolean => {
    if (movingUnit.faction === 'enemy') {
      return targetUnit.faction === 'player' || targetUnit.faction === 'ally';
    }
    if (movingUnit.faction === 'player' || movingUnit.faction === 'ally') {
      return targetUnit.faction === 'enemy';
    }
    return false;
  };

  const getOpposingZOC = (movingUnit: UnitData, units: UnitData[]): HexCoordinate[] => {
    return units
      .filter(u => isHostileUnit(movingUnit, u))
      .flatMap(u => getZoneOfControl(u.position));
  };

  const calculateNewRemainingMove = (
    current: HexCoordinate,
    neighbor: HexCoordinate,
    remainingMove: number,
    ignoresZOC: boolean,
    opposingZOC: HexCoordinate[]
  ): number => {
    const moveCost = 1;
    let newRemainingMove = remainingMove - moveCost;

    if (!ignoresZOC) {
      const currentInZOC = opposingZOC.some(zoc => 
        zoc.x === current.x && zoc.y === current.y
      );
      const neighborInZOC = opposingZOC.some(zoc => 
        zoc.x === neighbor.x && zoc.y === neighbor.y
      );
      
      if (currentInZOC && neighborInZOC) {
        newRemainingMove = 0;
      }
    }

    return newRemainingMove;
  };

  // Main function
  const getMoveableGrids = (startCoord: HexCoordinate, movement: number): HexCoordinate[] => {
    return movementCalculator.getMoveableGrids(startCoord, movement, units);
  };

  const handleCellHover = (coord: HexCoordinate, isHovering: boolean, isUnit: boolean) => {
    if (selectedUnit) {
      // Don't show hover effects if a unit is selected
      return;
    }

    if (isHovering && isUnit) {
      const unit = findUnitAtPosition(coord);
      if (unit) {  // Remove faction check to show all units' movement
        setSelectedUnitPosition(coord);
        const moveableGrids = getMoveableGrids(coord, unit.movement);
        setMoveableGrids(moveableGrids);
      }
    } else if (!isHovering) {
      setSelectedUnitPosition(null);
      setMoveableGrids([]);
    }
  };

  const handleCellClick = (coord: HexCoordinate, isRightClick: boolean) => {
    if (isRightClick) {
      // Cancel selection on right click
      setSelectedUnit(null);
      setSelectedUnitPosition(null);
      setMoveableGrids([]);
      return;
    }

    const unit = findUnitAtPosition(coord);
    if (unit) {  // Remove faction check to allow selecting any unit
      setSelectedUnit(unit);
      setSelectedUnitPosition(coord);
      const moveableGrids = getMoveableGrids(coord, unit.movement);
      setMoveableGrids(moveableGrids);
    }
  };

  const isMoveableCell = (coord: HexCoordinate): boolean => {
    if (!selectedUnitPosition) return false;
    const unit = selectedUnit || findUnitAtPosition(selectedUnitPosition);
    if (!unit) return false;  // Remove faction check here
    
    return moveableGrids.some(grid => grid.x === coord.x && grid.y === coord.y);
  };

  // Get the position of our single unit
  const getUnitPosition = () => {
    return units[0]?.position;  // Since we only have one unit
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
      onMouseLeave={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
    >
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
                unit={findUnitAtPosition(coord)}
                terrain={mapData.terrain[coord.y][coord.x] as TerrainType}
                isMoveable={isMoveableCell(coord)}
                onHover={handleCellHover}
                onClick={handleCellClick}
                unitPosition={selectedUnitPosition}
                findUnitAtPosition={findUnitAtPosition}
                isSelected={selectedUnit !== null && coord.x === selectedUnitPosition?.x && coord.y === selectedUnitPosition?.y}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}; 