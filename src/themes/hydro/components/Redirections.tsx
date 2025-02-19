import React, { useState, useEffect } from 'react';

interface Props {
  darkMode: boolean;
}

const BACKGROUNDS = {
  light: [
    'https://storage.googleapis.com/cj-mok-stash/fontaine30-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine31-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine32-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine33-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine34-bl.png'
  ],
  dark: [
    'https://storage.googleapis.com/cj-mok-stash/fontaine30-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine31-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine32-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine33-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine34-wl.png'
  ]
};

const containerStyles = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
  position: 'relative' as const,
  overflow: 'hidden'
};

const backgroundImageStyles = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '100%',
  maxHeight: '100%',
  opacity: 0.1,
  transition: 'opacity 1s ease-in-out',
  userSelect: 'none' as const,
  pointerEvents: 'none' as const,
  zIndex: 0
};

const contentStyles = {
  position: 'relative' as const,
  zIndex: 1,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'space-between',
  alignItems: 'center'
};

const ButtonFrame: React.FC<{ children: React.ReactNode; darkMode: boolean; rotate?: boolean }> = ({ children, darkMode, rotate }) => {
  return (
    <div style={{ position: 'relative' }}>
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          transform: rotate ? 'rotate(180deg)' : 'none',
        }}
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        {/* Background stroke (border effect) */}
        <path
          d="M 5,5
             L 175,5
             A 3,3 0 1 0 175,11
             C 180,11 185,6 188,10
             C 188,10, 190,12 191,15
             C 191,15 194,20 195,30
             L 195,75
             A 3,3 0 1 0 189,75
             C 189,75 189,78 190,80
             C 190,80 193,84 195,90
             L 195,90 195,155
             A 3,3 0 1 0 189,161
             C 190,161 197,174 190,180
             C 190,170 195,195 180,195
             L 25,195
             A 3,3 0 1 0 25,189
             C 20,189 15,194 12,190
             C 12,190 10,188 9,185
             C 9,185 6,180 5,170
             L 5,125
             A 3,3 0 1 0 11,125
             C 11,125 11,122 10,120
             C 10,120 7,116 5,110
             L 5,5"
          stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          fill="none"
        />
        {/* Main stroke (foreground) */}
        <path
          d="M 5,5
             L 175,5
             A 3,3 0 1 0 175,11
             C 180,11 185,6 188,10
             C 188,10, 190,12 191,15
             C 191,15 194,20 195,30
             L 195,75
             A 3,3 0 1 0 189,75
             C 189,75 189,78 190,80
             C 190,80 193,84 195,90
             L 195,90 195,155
             A 3,3 0 1 0 189,161
             C 190,161 197,174 190,180
             C 190,170 195,195 180,195
             L 25,195
             A 3,3 0 1 0 25,189
             C 20,189 15,194 12,190
             C 12,190 10,188 9,185
             C 9,185 6,180 5,170
             L 5,125
             A 3,3 0 1 0 11,125
             C 11,125 11,122 10,120
             C 10,120 7,116 5,110
             L 5,5"
          stroke={darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          fill="none"
        />
      </svg>
      {children}
    </div>
  );
};

const HydroRedirections: React.FC<Props> = ({darkMode}: Props) => {
  const [displayText, setDisplayText] = useState('Other places');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % BACKGROUNDS.light.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000); // Set interval to 5000ms (5 seconds)

    return () => clearInterval(interval);
  }, []); // Empty dependency array is fine here

  return (
    <div style={containerStyles}>
      <img
        src={darkMode ? BACKGROUNDS.dark[currentImageIndex] : BACKGROUNDS.light[currentImageIndex]}
        alt=""
        aria-hidden="true"
        style={{
          ...backgroundImageStyles,
          opacity: isTransitioning ? 0 : 0.1
        }}
      />
      <div style={contentStyles}>
        <div style={{
          fontSize: '2rem',
          color: darkMode ? '#fff' : '#000',
          textAlign: 'center' as const,
          padding: '20px',
          transition: 'all 0.3s ease',
        }}>
          {displayText}
        </div>
        <div style={{
          display: 'flex',
          gap: '60px',
          marginTop: 'auto',
          padding: '40px',
        }}>
          <ButtonFrame darkMode={darkMode}>
            <div 
              style={{
                cursor: 'pointer',
                width: '25vw',
                height: '25vh',
                color: darkMode ? '#fff' : '#000',
                transition: 'all 0.2s ease',
                fontSize: '3rem',
                fontWeight: '500',
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => window.location.href = '/stash'}
              onMouseEnter={() => setDisplayText('You can take a look on what I did. (Under construction)')}
              onMouseLeave={() => setDisplayText('Other places')}
            >
              Stash
            </div>
          </ButtonFrame>
          <ButtonFrame darkMode={darkMode} rotate={true}>
            <div 
              style={{
                cursor: 'pointer',
                width: '25vw',
                height: '25vh',
                color: darkMode ? '#fff' : '#000',
                transition: 'all 0.2s ease',
                fontSize: '3rem',
                fontWeight: '500',
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => window.location.href = '/labs'}
              onMouseEnter={() => setDisplayText('You can take a look on what I test.')}
              onMouseLeave={() => setDisplayText('Other places')}
            >
              Labs
            </div>
          </ButtonFrame>
        </div>
      </div>
    </div>
  );
}

export default HydroRedirections;