import React from 'react';
import SimpleGridUnit from './SimpleGridUnit';

interface AxialCoordinate {
  q: number;
  r: number;
}

interface SimpleMapUnitProps {
  mapWidth: number;  // Number of hexagons in width
  mapHeight: number; // Number of hexagons in height
  onUnitClick: (coordinate: AxialCoordinate) => void;
  onUnitHover: (coordinate: AxialCoordinate) => void;  // New prop for hover
}

const mapContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '25px',
  position: 'relative',
  width: 'max-content',  // Ensure the container is wide enough
} as const;

const rowStyles = {
  display: 'flex',
  alignItems: 'center',
} as const;

const generateMapData = (width: number, height: number): Array<{ coordinate: AxialCoordinate; terrainType: string; isOccupied: boolean; occupantId?: string }> => {
  const mapData = [];
  for (let r = height - 1; r >= 0; r--) {  // Start from the top row
    for (let q = 0; q < width; q++) {
      mapData.push({
        coordinate: { q, r },
        terrainType: 'grass',  // Default terrain type
        isOccupied: false,
      });
    }
  }
  return mapData;
};

const SimpleMapUnit: React.FC<SimpleMapUnitProps> = ({ mapWidth, mapHeight, onUnitClick, onUnitHover }) => {
  const mapData = generateMapData(mapWidth, mapHeight);

  return (
    <div style={mapContainerStyles}>
      {Array.from({ length: mapHeight }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ ...rowStyles, marginLeft: rowIndex % 2 === 0 ? '100px' : '0', marginTop: '-25px' }}>
          {mapData
            .filter(unit => unit.coordinate.r === mapHeight - 1 - rowIndex)  // Adjust to match the new order
            .map(unit => (
              <SimpleGridUnit
                key={`${unit.coordinate.q},${unit.coordinate.r}`}
                coordinate={unit.coordinate}
                terrainType={unit.terrainType}
                isOccupied={unit.isOccupied}
                onClick={onUnitClick}
                onHover={onUnitHover}  // Pass hover handler
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default SimpleMapUnit;
