import React from "react";

const emptyPageStyles = {
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
    paddingLeft: '10px',
  },
  topLayer: {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    boxSizing: 'border-box' as const,
    borderRadius: '8px',
    zIndex: 9,
    right: '-10px',
    border: '1px solid #000000',
  },
  content: {
    position: 'absolute' as const,
    zIndex: 10,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  bottomLayer: {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    boxSizing: 'border-box' as const,
    borderRadius: '8px',
    zIndex: 3,
    border: '1px solid #000000',
  }
};

interface EmptyPageProps {
  darkMode: boolean;
}

const EmptyPage = React.forwardRef<HTMLDivElement, EmptyPageProps>(
  ({ darkMode }, ref) => {
    const backgroundColor = darkMode ? '#3a3a3a' : '#e8e8e8';

    return (
      <div ref={ref} data-density="hard" style={emptyPageStyles.container}>
        <div style={emptyPageStyles.wrapper}>
          <div style={emptyPageStyles.goldFrame} />
          <div style={{ ...emptyPageStyles.topLayer, background: backgroundColor }} />
          <div style={emptyPageStyles.content}>
            This page is intentionally left blank
          </div>
          <div style={{ ...emptyPageStyles.bottomLayer, background: backgroundColor }} />
        </div>
      </div>
    );
  }
);

export default EmptyPage;