import React from 'react';
import { UnitData } from '../types/UnitData';

interface UnitInfoDisplayProps {
  unit: UnitData;
  mousePosition: { x: number, y: number };
}

export const UnitInfoDisplay: React.FC<UnitInfoDisplayProps> = ({ unit, mousePosition }) => {
  const isLeftSide = mousePosition.x < window.innerWidth / 2;

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 10,
    [isLeftSide ? 'right' : 'left']: '20px',
    backgroundColor: 'white',
    padding: '20px',
    border: '2px solid black',
    zIndex: 9999,
    display: 'block',
    width: '300px',
    height: '500px',
    overflow: 'auto',
  };

  const textStyle: React.CSSProperties = {
    display: 'block',
    width: 'auto',
    height: 'auto',
    fontSize: '16px',
    lineHeight: '24px',
    color: 'black',
    margin: '8px 0',
    padding: '4px 0',
    whiteSpace: 'pre-wrap',
    overflow: 'visible',
  };

  return (
    <div style={containerStyle}>
      <div style={{ ...textStyle, fontSize: '20px', fontWeight: 'bold' }}>
        {unit.name || 'NO NAME'}
      </div>
      <div style={textStyle}>
        Class: {unit.class || 'NO CLASS'}
      </div>
      <div style={textStyle}>
        Description: {unit.description || 'NO DESCRIPTION'}
      </div>
      <div style={textStyle}>
        Fraction: {unit.fraction || 'NO FRACTION'}
      </div>
      <div style={textStyle}>
        Position: x:{unit.position.x || '?'}, y:{unit.position.y || '?'}
      </div>
    </div>
  );
};

UnitInfoDisplay.displayName = 'UnitInfoDisplay'; 