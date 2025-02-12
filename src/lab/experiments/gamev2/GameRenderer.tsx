import React, { useRef, useState, useEffect } from "react";
import AxialCoordinate from "../game/AxialCoordinate";
import { eventBus } from "./EventBus";

// Types
interface GameRendererProps {
  width: number;
  height: number;
}

interface HexCellProps {
  coordinate: AxialCoordinate;
}

// Grid constants
const GRID = {
  WIDTH: 100,  // Exact width of hexagon
  ROW_OFFSET: 50  // Fixed offset for even rows
};

// Hex Cell Component
const HexCell: React.FC<HexCellProps> = ({ coordinate }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    eventBus.emit('unit-hovered', { unitId: `${coordinate.r},${coordinate.q}` });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default browser context menu
    
    if (e.button === 0) { // Left click
      console.log(`Clicked coordinate: (${coordinate.r}, ${coordinate.q})`);
    } else if (e.button === 2) { // Right click
      console.log('menu');
    }
  };

  return (
    <div 
      style={{
        width: `${GRID.WIDTH}px`,
        height: `${GRID.WIDTH}px`,
        backgroundColor: isHovered ? '#4a90e2' : '#f0f0f0',
        clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'default',
        userSelect: 'none',
        fontSize: '14px',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        flexShrink: 0,
        flexGrow: 0,
        position: 'relative',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onContextMenu={handleClick}
    >
      ({coordinate.r}, {coordinate.q})
    </div>
  );
};

// Main Renderer Component
export const GameRenderer: React.FC<GameRendererProps> = ({ width, height }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  const SCROLL_THRESHOLD = 100; // pixels from edge
  const SCROLL_SPEED = 15; // pixels per frame
  const PADDING = 400; // Extra space on each side

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

  // Grid generation
  const generateGrid = () => {
    const grid: AxialCoordinate[][] = [];
    for (let r = height - 1; r >= 0; r--) {
      const row: AxialCoordinate[] = [];
      for (let q = 0; q < width; q++) {
        row.push({ q: r, r: q });
      }
      grid.push(row);
    }
    return grid;
  };

  const grid = generateGrid();

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
              <HexCell key={`${coord.q},${coord.r}`} coordinate={coord} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}; 