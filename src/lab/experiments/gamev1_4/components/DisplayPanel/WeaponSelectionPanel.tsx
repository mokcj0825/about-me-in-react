import React from 'react';
import { UnitData } from '../../types/UnitData';
import { Z_INDEX } from '../../constants/zIndex';

interface WeaponSelectionPanelProps {
  unit: UnitData;
  onWeaponSelect: (weaponId: string, unit: UnitData) => void;
  onClose: () => void;
  style?: React.CSSProperties;
}

export const WeaponSelectionPanel: React.FC<WeaponSelectionPanelProps> = ({
  unit,
  onWeaponSelect,
  onClose,
  style
}) => {
  const panelStyle: React.CSSProperties = {
    ...style,
    background: 'rgba(0, 0, 0, 0.8)',
    border: '1px solid #666',
    borderRadius: '4px',
    padding: '10px',
    color: 'white',
    minWidth: '200px',
    maxHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: Z_INDEX.WEAPON_PANEL
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    flexShrink: 0
  };

  const titleStyle: React.CSSProperties = {
    margin: 0
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer'
  };

  const weaponsListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflowY: 'auto',
    maxHeight: '250px'
  };

  const weaponButtonStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid #666',
    borderRadius: '4px',
    padding: '8px',
    color: 'white',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.2s'
  };

  const weaponInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
  };

  const weaponNameStyle: React.CSSProperties = {
    fontWeight: 'bold'
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Select Weapon</h3>
        <button style={closeButtonStyle} onClick={onClose}>×</button>
      </div>
      
      <div style={weaponsListStyle}>
        {unit.weapon.map(weaponId => (
          <button
            key={weaponId}
            style={weaponButtonStyle}
            onClick={() => onWeaponSelect(weaponId, unit)}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <div style={weaponInfoStyle}>
              <span style={weaponNameStyle}>{weaponId}</span>
              {/* Add more weapon details here once we have weapon data */}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};