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
    }, 4500);

    return () => clearInterval(interval);
  }, []);

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
          <div 
            style={{
              cursor: 'pointer',
              padding: '20px 40px',
              borderRadius: '12px',
              background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              color: darkMode ? '#fff' : '#000',
              transition: 'all 0.2s ease',
              fontSize: '1.5rem',
              fontWeight: '500',
            }}
            onClick={() => window.location.href = '/stash'}
            onMouseEnter={() => setDisplayText('You can take a look on what I did. (Under construction)')}
            onMouseLeave={() => setDisplayText('Other places')}
          >
            Stash
          </div>
          <div 
            style={{
              cursor: 'pointer',
              padding: '20px 40px',
              borderRadius: '12px',
              background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              color: darkMode ? '#fff' : '#000',
              transition: 'all 0.2s ease',
              fontSize: '1.5rem',
              fontWeight: '500',
            }}
            onClick={() => window.location.href = '/labs'}
            onMouseEnter={() => setDisplayText('You can take a look on what I test.')}
            onMouseLeave={() => setDisplayText('Other places')}
          >
            Labs
          </div>
        </div>
      </div>
    </div>
  );
}

export default HydroRedirections;