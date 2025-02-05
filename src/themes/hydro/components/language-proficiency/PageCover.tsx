import React from "react";

const coverStyles = {
  container: {
    width: '100%',
    height: '100%',
  },
  wrapper: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    borderRadius: '8px',
  },
  goldFrame: {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    boxSizing: 'border-box' as const,
    borderRadius: '8px',
    zIndex: 7,
    background: '#D4AF37',
    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.2)',
    border: '1px solid #000000',
    paddingRight: '10px',
  },
  mainLayer: {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    boxSizing: 'border-box' as const,
    borderRadius: '8px',
    zIndex: 9,
    left: '-10px',
    border: '1px solid #000000',
    marginRight: '10px'
  },
  titleContainer: {
    position: 'absolute' as const,
    zIndex: 10,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalStrip: {
    position: 'absolute' as const,
    width: '10px',
    height: '94%',
    bottom: '3%',
    left: '5px',
    boxShadow: 'border-box',
    zIndex: 11,
    background: 'darkcyan',
  },
  decorativeBox: {
    position: 'absolute' as const,
    width: '50%',
    height: '30%',
    boxSizing: 'border-box' as const,
    zIndex: 11,
    background: 'green',
  },
  innerBox: {
    position: 'absolute' as const,
    width: 'calc(50% - 10px)',
    height: 'calc(30% - 10px)',
    boxSizing: 'border-box' as const,
    zIndex: 12,
  }
};

interface PageCoverProps {
  darkMode: boolean;
}

const PageCover = React.forwardRef<HTMLDivElement, PageCoverProps>(
  ({ darkMode }, ref) => {
    const backgroundColor = darkMode ? '#3a3a3a' : '#e8e8e8';

    return (
      <div ref={ref} data-density="hard" style={coverStyles.container}>
        <div style={coverStyles.wrapper}>
          <div style={coverStyles.goldFrame} />
          <div style={{ ...coverStyles.mainLayer, background: backgroundColor }} />
          
          <div style={coverStyles.titleContainer}>
            <h2>Language</h2>
            <h2>Proficiency</h2>
          </div>

          {/* Decorative elements */}
          <div style={coverStyles.verticalStrip} />
          
          {/* Bottom decorative boxes */}
          <div style={{ ...coverStyles.decorativeBox, bottom: '15px', right: '25px' }} />
          <div style={{ 
            ...coverStyles.innerBox, 
            bottom: '25px', 
            right: '35px',
            background: backgroundColor 
          }} />

          {/* Top decorative boxes */}
          <div style={{ ...coverStyles.decorativeBox, top: '15px', right: '25px' }} />
          <div style={{ 
            ...coverStyles.innerBox, 
            top: '25px', 
            right: '35px',
            background: backgroundColor 
          }} />
        </div>
      </div>
    );
  }
);

export default PageCover;