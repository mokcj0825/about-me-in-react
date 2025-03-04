import React from 'react';
import {Z_INDEX} from "../../constants/zIndex";

export const ControlHints: React.FC = () => {
  return (
    <div style={containerStyle}>
      <HintItem shortcut={'T'} tooltip={'地形信息'} />
      <HintItem shortcut={'Esc'} tooltip={'主菜单'} />
    </div>
  );
};

const HintItem: React.FC<{shortcut: string, tooltip: string}> = (props: {shortcut: string, tooltip: string}) => {
  return (
      <div>
        <span style={keyStyle}>{props.shortcut}</span>
        <span style={tooltipStyle}>{props.tooltip}</span>
      </div>
  );
};

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  padding: '8px 16px',
  borderRadius: '4px',
  color: 'white',
  fontSize: '14px',
  display: 'flex',
  gap: '16px',
  zIndex: Z_INDEX.CONTROL_HINTS
};

const keyStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  padding: '2px 8px',
  borderRadius: '3px',
  fontWeight: 'bold'
};

const tooltipStyle: React.CSSProperties = {
  marginLeft: '8px'
}