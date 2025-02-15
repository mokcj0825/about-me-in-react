import React, { useRef, useState, useEffect } from "react";
import { HexCoordinate, createHexCoordinate, getNeighbors, getZoneOfControl } from "./types/HexCoordinate";
import { UnitData, initialUnits } from "./types/UnitData";
import { HexCell } from "./components/HexCell";

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

  const SCROLL_THRESHOLD = 100;
  const SCROLL_SPEED = 15;
  const PADDING = 400;

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

  const findUnitAtPosition = (coord: HexCoordinate) => {
    return units.find(unit => 
      unit.position.x === coord.x && 
      unit.position.y === coord.y && 
      unit.position.z === coord.z
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

  // Function to get all grids within movement range
  const getMoveableGrids = (startCoord: HexCoordinate, movement: number): HexCoordinate[] => {
    const result: HexCoordinate[] = [];
    const visited = new Set<string>();
    const movementCosts = new Map<string, number>();
    
    // Get the unit at start position to determine faction
    const movingUnit = findUnitAtPosition(startCoord);
    if (!movingUnit) return [];

    // Get ZOC based on opposing factions
    const opposingZOC = units
      .filter(u => {
        if (movingUnit.faction === 'enemy') {
          return u.faction === 'player' || u.faction === 'ally';
        } else {
          return u.faction === 'enemy';
        }
      })
      .flatMap(u => getZoneOfControl(u.position));
    
    // Priority queue for A* pathfinding
    const queue: [HexCoordinate, number][] = [[startCoord, 0]];
    visited.add(`${startCoord.x},${startCoord.y}`);
    movementCosts.set(`${startCoord.x},${startCoord.y}`, 0);

    while (queue.length > 0) {
      const [current, cost] = queue.shift()!;
      
      if (cost <= movement) {
        result.push(current);
        
        const neighbors = getNeighbors(current);
        for (const neighbor of neighbors) {
          const key = `${neighbor.x},${neighbor.y}`;
          
          // Check if neighbor is in opposing ZOC
          const isInOpposingZOC = opposingZOC.some(zoc => 
            zoc.x === neighbor.x && zoc.y === neighbor.y
          );
          
          // If we're already in ZOC, allow movement to non-ZOC tiles
          const currentInZOC = opposingZOC.some(zoc => 
            zoc.x === current.x && zoc.y === current.y
          );
          
          // Calculate movement cost
          let movementCost = cost + 1;
          if (isInOpposingZOC && !currentInZOC) {
            // Only pay extra cost when entering ZOC
            movementCost += 1;
          }
          
          const existingCost = movementCosts.get(key);
          if (movementCost <= movement && (!existingCost || movementCost < existingCost)) {
            visited.add(key);
            movementCosts.set(key, movementCost);
            
            const insertIndex = queue.findIndex(([_, c]) => c > movementCost);
            if (insertIndex === -1) {
              queue.push([neighbor, movementCost]);
            } else {
              queue.splice(insertIndex, 0, [neighbor, movementCost]);
            }
          }
        }
      }
    }

    return result;
  };

  const handleCellHover = (coord: HexCoordinate, isHovering: boolean, isUnit: boolean) => {
    if (isHovering && isUnit) {
      const unit = findUnitAtPosition(coord);
      if (unit) {
        setSelectedUnitPosition(coord);
        const moveableGrids = getMoveableGrids(coord, unit.movement);
        setMoveableGrids(moveableGrids);
      }
    } else if (!isHovering) {
      setSelectedUnitPosition(null);
      setMoveableGrids([]);
    }
  };

  const isMoveableCell = (coord: HexCoordinate) => {
    return moveableGrids.some(grid => 
      grid.x === coord.x && 
      grid.y === coord.y && 
      grid.z === coord.z
    );
  };

  // Get the position of our single unit
  const getUnitPosition = () => {
    return units[0]?.position;  // Since we only have one unit
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 2) { // Middle or right click
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

  const handleMouseUp = () => {
    setIsDragging(false);
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
        backgroundColor: '#e0e0e0',
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
        backgroundColor: '#e0e0e0',
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
                isMoveable={isMoveableCell(coord)}
                onHover={handleCellHover}
                unitPosition={selectedUnitPosition}
                findUnitAtPosition={findUnitAtPosition}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}; 