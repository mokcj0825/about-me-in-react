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
}

const mapContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  position: 'relative',
} as const;

const rowStyles = {
  display: 'flex',
} as const;

const generateMapData = (width: number, height: number): Array<{ coordinate: AxialCoordinate; terrainType: string; isOccupied: boolean; occupantId?: string }> => {
  const mapData = [];
  for (let r = 0; r < height; r++) {
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

const SimpleMapUnit: React.FC<SimpleMapUnitProps> = ({ mapWidth, mapHeight, onUnitClick }) => {
  const mapData = generateMapData(mapWidth, mapHeight);

  return (
    <div style={mapContainerStyles}>
      {Array.from({ length: mapHeight }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ ...rowStyles, marginLeft: rowIndex % 2 === 0 ? '0' : '50px' }}>
          {mapData
            .filter(unit => unit.coordinate.r === rowIndex)
            .map(unit => (
              <SimpleGridUnit
                key={`${unit.coordinate.q},${unit.coordinate.r}`}
                coordinate={unit.coordinate}
                terrainType={unit.terrainType}
                isOccupied={unit.isOccupied}
                onClick={onUnitClick}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default SimpleMapUnit;
