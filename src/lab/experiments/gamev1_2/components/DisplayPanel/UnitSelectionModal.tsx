import React from 'react';
import { UnitData } from '../../types/UnitData';

interface Props {
  units: UnitData[];
  position: { x: number; y: number };
  onSelect: (unit: UnitData) => void;
  onClose: () => void;
}

export const UnitSelectionModal: React.FC<Props> = ({ units, position, onSelect, onClose }) => {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: position.y,
    left: position.x,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    padding: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    zIndex: 10000,
    minWidth: '200px',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  };

  const unitItemStyle: React.CSSProperties = {
    padding: '8px',
    margin: '4px 0',
    cursor: 'pointer',
    borderRadius: '2px',
    transition: 'background-color 0.2s',
  };

  return (
    <div style={containerStyle}>
      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)', padding: '4px', marginBottom: '8px' }}>
        Select Unit
      </div>
      {units.map((unit, index) => (
        <div
          key={unit.id}
          style={unitItemStyle}
          className="unit-selection-item"
          onClick={() => onSelect(unit)}
        >
          <div style={{ fontWeight: 'bold' }}>{unit.name}</div>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>
            {unit.class} {unit.movementType === 'flying' ? '(Flying)' : '(Ground)'}
          </div>
        </div>
      ))}
    </div>
  );
}; 