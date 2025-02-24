import React from 'react';
import { UnitData } from '../../types/UnitData';

interface Props {
  /** The unit data to display information for */
  unit: UnitData;
  
  /** The current mouse position to position the info display */
  mousePosition: { x: number; y: number };
}

/**
 * UnitInfoDisplay component - Renders a floating information panel for units
 * 
 * Displays detailed unit information in a fixed position panel, including:
 * - Unit name
 * - Class
 * - Description
 * - Faction
 * - Movement details
 * - Position coordinates
 * 
 * The panel position adjusts based on mouse location to prevent edge overflow.
 * 
 * @component
 * @example
 * ```tsx
 * <UnitInfoDisplay
 *   unit={unitData}
 *   mousePosition={{ x: 100, y: 200 }}
 * />
 * ```
 */
export const UnitInfoDisplay: React.FC<Props> = ({ unit, mousePosition }) => {
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
        Faction: {unit.faction || 'NO FACTION'}
      </div>
      <div style={textStyle}>
        Movement: {unit.movement || '0'} ({unit.movementType || 'Unknown'})
      </div>
      <div style={textStyle}>
        Position: x:{unit.position.x || '?'}, y:{unit.position.y || '?'}
      </div>
    </div>
  );
};

UnitInfoDisplay.displayName = 'UnitInfoDisplay'; 