import React from 'react';

interface AxialCoordinate {
  q: number;
  r: number;
}

interface SimpleGridUnitProps {
  coordinate: AxialCoordinate;
  terrainType: string;
  isOccupied: boolean;
  occupantId?: string;
  onClick: (coordinate: AxialCoordinate) => void;
}

const hexagonStyles = {
  width: '100px',
  height: '100px',
  backgroundColor: '#ccc',
  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
} as const;

const SimpleGridUnit: React.FC<SimpleGridUnitProps> = ({
  coordinate,
  terrainType,
  isOccupied,
  occupantId,
  onClick,
}) => {
  const handleClick = () => {
    onClick(coordinate);
  };

  return (
    <div
      style={{
        ...hexagonStyles,
        backgroundColor: isOccupied ? '#f00' : '#ccc', // Red if occupied
      }}
      onClick={handleClick}
    >
      <div>
        <p>{`(${coordinate.q}, ${coordinate.r})`}</p>
        <p>{terrainType}</p>
        {isOccupied && <p>Occupied by: {occupantId}</p>}
      </div>
    </div>
  );
};

export default SimpleGridUnit;
