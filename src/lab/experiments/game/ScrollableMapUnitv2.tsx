import React, { useRef, useEffect, useState } from 'react';
import SimpleMapUnit from './SimpleMapUnit';
import UnitManager from './UnitManager';

interface ScrollableMapUnitProps {
  mapWidth: number;
  mapHeight: number;
  onUnitClick: (coordinate: { q: number; r: number }) => void;
}

const scrollableContainerStyles = {
  position: 'relative',
  width: '100%',
  height: 'calc(100vh - 30px)',
  overflow: 'hidden',
  borderTop: '20px solid transparent',
  borderRight: '20px solid transparent',
  borderLeft: '20px solid transparent',
  borderBottom: 'none',
} as const;

const bottomBarStyles = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '30px',
  backgroundColor: '#333',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;

const ScrollableMapUnitv2: React.FC<ScrollableMapUnitProps> = ({ mapWidth, mapHeight, onUnitClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [hoveredCoordinate, setHoveredCoordinate] = useState<{ q: number; r: number } | null>(null);
  const [scrollDirection, setScrollDirection] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!mapRef.current) return;

    const { clientX, clientY, currentTarget } = e;
    const { offsetWidth, offsetHeight } = currentTarget as HTMLDivElement;
    const edgeThreshold = 20;  // Adjusted for thinner borders

    let x = 0;
    let y = 0;

    if (clientX < edgeThreshold) {
      x = -1;
    } else if (clientX > offsetWidth - edgeThreshold) {
      x = 1;
    }

    if (clientY < edgeThreshold) {
      y = -1;
    } else if (clientY > offsetHeight - edgeThreshold) {
      y = 1;
    }

    setScrollDirection({ x, y });
  };

  useEffect(() => {
    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener('mousemove', handleMouseMove);
    }

    const scrollInterval = setInterval(() => {
      if (mapElement) {
        const scrollSpeed = 5;
        mapElement.scrollLeft += scrollDirection.x * scrollSpeed;
        mapElement.scrollTop += scrollDirection.y * scrollSpeed;
      }
    }, 16);

    return () => {
      if (mapElement) {
        mapElement.removeEventListener('mousemove', handleMouseMove);
      }
      clearInterval(scrollInterval);
    };
  }, [scrollDirection]);

  const handleHover = (coordinate: { q: number; r: number }) => {
    setHoveredCoordinate(coordinate);
  };

  return (
    <UnitManager>
      <div style={{ position: 'relative', height: '100vh' }}>
        <div ref={mapRef} style={scrollableContainerStyles}>
          <SimpleMapUnit
            mapWidth={mapWidth}
            mapHeight={mapHeight}
            onUnitClick={onUnitClick}
            onUnitHover={handleHover}
          />
        </div>
        <div style={bottomBarStyles}>
          {hoveredCoordinate ? `Hovered Coordinate: (${hoveredCoordinate.q}, ${hoveredCoordinate.r})` : 'Hover over a hexagon'}
        </div>
      </div>
    </UnitManager>
  );
};

export default ScrollableMapUnitv2;