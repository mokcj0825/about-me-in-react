import React from 'react';

export const ControlHints: React.FC = () => {
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
    zIndex: 101
  };

  const keyStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '2px 8px',
    borderRadius: '3px',
    fontWeight: 'bold'
  };

  return (
    <div style={containerStyle}>
      <div>
        <span style={keyStyle}>T</span>
        <span style={{ marginLeft: '8px' }}>地形信息</span>
      </div>
    </div>
  );
}; 