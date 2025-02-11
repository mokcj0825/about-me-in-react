import React from 'react';

interface AxialCoordinate {
  q: number;
  r: number;
}

interface MapUnitProps {
  coordinate: AxialCoordinate;
  hexSize: number; // Size of the hexagon
  mapHeight: number; // Total number of hexagons in height
}

const MapUnit: React.FC<MapUnitProps> = ({ coordinate, hexSize, mapHeight }) => {
  // Match the exact grid layout from SimpleMapUnit
  const rowOffset = (mapHeight - 1 - coordinate.r) % 2 === 0 ? 100 : 0;
  const x = hexSize * 3/2 * coordinate.q + rowOffset;
  const y = hexSize * Math.sqrt(3) * (mapHeight - 1 - coordinate.r);

  const unitStyles = {
    width: '40px',
    height: '40px',
    backgroundColor: 'blue',
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    pointerEvents: 'none', // Allow mouse events to pass through
  } as const;

  return <div style={unitStyles} />;
};

export default MapUnit;
