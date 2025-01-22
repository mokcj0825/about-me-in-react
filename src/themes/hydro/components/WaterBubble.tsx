import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface WaterBubbleProps {
  title: string;
  children: React.ReactNode;
  darkMode?: boolean;
  bubbleSize?: number; // Optional size in pixels
}

const WaterBubble: React.FC<WaterBubbleProps> = ({ 
  title, 
  children, 
  darkMode = false,
  bubbleSize = 200,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create portal container
    const container = document.createElement('div');
    container.id = `water-bubble-portal-${Math.random().toString(36).substr(2, 9)}`;
    document.body.appendChild(container);
    setPortalContainer(container);

    // Cleanup
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  // Dynamic styles based on props
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      margin: '4rem 0',
      position: 'relative',
      zIndex: 1,
    } as const,

    bubble: {
      width: `${bubbleSize}px`,
      height: `${bubbleSize}px`,
      borderRadius: '50%',
      background: darkMode 
        ? 'linear-gradient(145deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05))'
        : 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05))',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: darkMode 
        ? '1px solid rgba(0,0,0,0.1)'
        : '1px solid var(--hydro-text)',
      boxShadow: darkMode
        ? 'inset 0 1px 3px rgba(0, 0, 0, 0.2), 0 4px 15px rgba(0, 0, 0, 0.1)'
        : 'inset 0 1px 3px rgba(12, 123, 147, 0.2), 0 4px 15px var(--hydro-text)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.3s ease',
      animation: 'float 3s ease-in-out infinite',
    } as const,

    bubbleTitle: {
      color: darkMode ? 'var(--hydro-light)' : 'var(--hydro-text)',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      zIndex: 1,
      position: 'relative' as const,
    },

    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: darkMode 
        ? 'rgba(20, 40, 80, 0.7)'  // Darker overlay
        : 'rgba(0, 168, 204, 0.3)', // Light hydro-primary with opacity
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease',
    },

    bubbleContent: {
      width: '90%',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflowY: 'auto' as const,
      padding: '2rem',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '15px',
      animation: 'fadeIn 0.3s ease',
      color: darkMode ? 'var(--hydro-light)' : 'var(--hydro-text)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    },

    backButton: {
      position: 'absolute' as const,
      top: '1rem',
      right: '1rem',
      background: 'transparent',
      border: 'none',
      color: darkMode ? 'var(--hydro-light)' : 'var(--hydro-text)',
      fontSize: '1.5rem',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      },
    } as const,

    rippleEffect: {
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
        animation: 'ripple 2s linear infinite',
      },
    } as const,
  };

  // Inject required keyframe animations
  React.useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }

      @keyframes ripple {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Apply styles as inline styles with necessary transformations
  const applyStyles = (baseStyles: any) => {
    const style: any = { ...baseStyles };
    delete style['&:hover'];
    delete style['&:active'];
    delete style['&::before'];
    return style;
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div style={styles.container}>
        <div 
          style={{
            ...applyStyles(styles.bubble),
            ...applyStyles(styles.rippleEffect),
          }}
          onClick={() => setIsExpanded(true)}
          onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            target.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            target.style.transform = 'scale(1)';
          }}
          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            target.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            target.style.transform = 'scale(1.05)';
          }}
        >
          <span style={styles.bubbleTitle}>{title}</span>
        </div>
      </div>

      {isExpanded && portalContainer && ReactDOM.createPortal(
        <div style={styles.overlay} onClick={handleClose}>
          <div style={styles.bubbleContent} onClick={handleContentClick}>
            {children}
          </div>
        </div>,
        portalContainer
      )}
    </>
  );
};

export default WaterBubble;
