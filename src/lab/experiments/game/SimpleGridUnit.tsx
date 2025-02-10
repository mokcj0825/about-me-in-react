import React, { useState } from 'react';

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

const SimpleGridUnit: React.FC<SimpleGridUnitProps> = ({
  coordinate,
  terrainType,
  isOccupied,
  occupantId,
  onClick,
  onHover,
}) => {
  const [isHovered, setIsHovered] = useState(false);

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
        {isOccupied && <p>Occupied by: {occupantId}</p>}
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