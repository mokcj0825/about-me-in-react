import React from 'react';
import Theater from './Theater';

const WebGLIntegration: React.FC = () => {
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>WebGL Integration</h1>
      <p>Testing WebGL integration with Three.js</p>
      
      <div style={{
        width: '100%',
        height: '400px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        marginTop: '2rem'
      }}>
        <Theater />
      </div>
    </div>
  );
};

export default WebGLIntegration; 