import React, { ReactNode } from 'react';
interface CanvasProps {
  children: ReactNode;
}

const Canvas: React.FC<CanvasProps> = ({ children }) => {
  const handleThemeChange = (theme: string) => {
    console.log(`Switching to ${theme} theme`);
  };

  const selectorStyles = {
    container: {
      position: 'fixed' as const,
      top: '20px',
      right: '20px',
      display: 'flex',
      gap: '20px',
      padding: '10px',
      zIndex: 1000,
    }
  };

  return (
    <div className="base-canvas">
      <div style={selectorStyles.container}>
      </div>
      <div className="canvas-content">
        {children}
      </div>
    </div>
  );
};

export default Canvas;
