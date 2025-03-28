import React from 'react';
import { Unit } from '../type/InstructionData';

interface UnitCardProps {
  unit: Unit;
}

export const UnitCard: React.FC<UnitCardProps> = ({ unit }) => {
  return (
    <div style={{
      padding: '8px',
      marginBottom: '8px',
      border: '1px solid #eee',
      borderRadius: '4px'
    }}>
      <div style={{ fontWeight: 'bold' }}>{unit.name}</div>
      {unit.hp !== undefined && <div>HP: {unit.hp}/{unit.maxHp}</div>}
      {unit.energy !== undefined && (
        <div>Energy: {unit.energy}/{unit.maxEnergy}</div>
      )}
      {unit.attack && <div>Attack: {unit.attack}</div>}
      {unit.target_type && <div>Target: {unit.target_type}</div>}
    </div>
  );
};

export default UnitCard; 