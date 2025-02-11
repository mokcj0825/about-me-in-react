import React, { useState } from 'react';
import { useUnits, Fraction } from './UnitManager';

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
  onHover: (coordinate: AxialCoordinate) => void;
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
  position: 'relative',  // Ensure the hover layer is positioned correctly
} as const;

const getFractionColor = (fraction: Fraction) => {
  switch (fraction) {
    case Fraction.BLUE:
      return 'blue';
    case Fraction.RED:
      return 'red';
    case Fraction.GREEN:
      return 'green';
    case Fraction.NEUTRAL:
      return 'gray';
    default:
      return 'blue';
  }
};

const SimpleGridUnit: React.FC<SimpleGridUnitProps> = ({
  coordinate,
  terrainType,
  onClick,
  onHover,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { getUnitAt } = useUnits();
  const unit = getUnitAt(coordinate.q, coordinate.r);

  const handleClick = () => {
    onClick(coordinate);
  };

  const handleMouseEnter = () => {
    onHover(coordinate);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      style={hexagonStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 255, 0.3)', // Semi-transparent blue overlay
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            pointerEvents: 'none',
          }}
        />
      )}
      <div>
        <p>{`(${coordinate.q}, ${coordinate.r})`}</p>
        <p>{terrainType}</p>
        {unit && (
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: getFractionColor(unit.fraction),
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </div>
    </div>
  );
};

// Add CSS for hover effect
const styles = `
  .hover-layer:hover {
    border-color: blue;  // Change border color on hover
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default SimpleGridUnit;