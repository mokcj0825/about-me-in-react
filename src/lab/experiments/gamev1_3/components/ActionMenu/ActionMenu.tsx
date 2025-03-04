import React from 'react';
import { Z_INDEX } from '../../constants/zIndex';

interface ActionMenuProps {
  position: { x: number; y: number };
  onStandby: () => void;
  onCancel: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ position, onStandby, onCancel }) => {
  const menuItems = [
    { label: '攻击', disabled: true },
    { label: '技能', disabled: true },
    { label: '道具', disabled: true },
    { label: '待命', disabled: false },
  ];

  return (
    <div style={{
      position: 'absolute',
      left: position.x,
      top: position.y,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      padding: '4px',
      zIndex: Z_INDEX.ACTION_MENU,
    }}>
      {menuItems.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            if (!item.disabled) {
              if (item.label === '待命') onStandby();
            }
          }}
          style={{
            padding: '8px 16px',
            color: item.disabled ? 'rgba(255, 255, 255, 0.5)' : 'white',
            cursor: item.disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}; 