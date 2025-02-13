import React, { useRef, useState, useEffect } from "react";
import { HexCoordinate, createHexCoordinate, getNeighbors } from "./types/HexCoordinate";
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
  const mapRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

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
    
    const queue: [HexCoordinate, number][] = [[startCoord, 0]];
    visited.add(`${startCoord.x},${startCoord.y}`);

    while (queue.length > 0) {
      const [current, distance] = queue.shift()!;
      
      if (distance <= movement) {
        result.push(current);
        
        if (distance < movement) {
          const neighbors = getNeighbors(current);
          for (const neighbor of neighbors) {
            const key = `${neighbor.x},${neighbor.y}`;
            if (!visited.has(key)) {
              visited.add(key);
              queue.push([neighbor, distance + 1]);
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
        const moveableGrids = getMoveableGrids(coord, unit.movement);
        setMoveableGrids(moveableGrids);
      }
    } else if (!isHovering) {
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

  return (
    <div ref={mapRef} style={{
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#e0e0e0',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      cursor: 'default'
    }}>
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
                unitPosition={getUnitPosition()}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}; 