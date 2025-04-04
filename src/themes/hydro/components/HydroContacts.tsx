import React, { useState, useEffect } from 'react';

interface Props {
  darkMode: boolean;
}

const BACKGROUNDS = {
  light: [
    'https://storage.googleapis.com/cj-mok-stash/fontaine40-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine41-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine42-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine43-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine44-bl.png'
  ],
  dark: [
    'https://storage.googleapis.com/cj-mok-stash/fontaine40-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine41-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine42-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine43-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine44-wl.png'
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

const linkStyles = (darkMode: boolean) => ({
  cursor: 'pointer',
  padding: '30px 60px',
  borderRadius: '16px',
  background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  color: darkMode ? '#fff' : '#000',
  transition: 'all 0.2s ease',
  fontSize: '2rem',
  fontWeight: '500',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '250px',
  height: '120px',
  textAlign: 'center' as const
});

const HydroContacts: React.FC<Props> = ({darkMode}: Props) => {
  const [displayText, setDisplayText] = useState('Contact me');
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
          fontSize: '2.5rem',
          color: darkMode ? '#fff' : '#000',
          textAlign: 'center' as const,
          padding: '40px',
          transition: 'all 0.3s ease',
        }}>
          {displayText}
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row' as const,
          gap: '50px',
          justifyContent: 'center',
          padding: '60px',
          width: '100%',
        }}>
          <a 
            href="mailto:mokcjmok@gmail.com"
            style={linkStyles(darkMode)}
            onMouseEnter={() => setDisplayText('Send me an email')}
            onMouseLeave={() => setDisplayText('Contact me')}
          >
            Email
          </a>
          <a 
            href="https://github.com/mokcj0825"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyles(darkMode)}
            onMouseEnter={() => setDisplayText('Check out my GitHub')}
            onMouseLeave={() => setDisplayText('Contact me')}
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com/in/cj-mok-52907642"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyles(darkMode)}
            onMouseEnter={() => setDisplayText('Connect on LinkedIn')}
            onMouseLeave={() => setDisplayText('Contact me')}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

export default HydroContacts;
