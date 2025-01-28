import React, { useState, useEffect } from 'react';
import headerData from '../../../data/header.json';

const BACKGROUNDS = {
  light: [
    'https://storage.googleapis.com/cj-mok-stash/fontaine00-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine01-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine02-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine03-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine04-bl.png'
  ],
  dark: [
    'https://storage.googleapis.com/cj-mok-stash/fontaine00-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine01-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine02-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine03-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine04-wl.png'
  ]
};

interface HeaderProps {
  darkMode: boolean;
}

const containerStyles = {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  position: 'relative',
  overflow: 'hidden'
} as const;

const backgroundContainerStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
} as const;

const backgroundImageStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '100%',
  maxHeight: '100%',
  opacity: 0.1,
  transition: 'opacity 1s ease-in-out',
  userSelect: 'none',
  pointerEvents: 'none'
} as const;

const contentContainerStyles = {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '15px'
} as const;

const titleStyles = {
  fontSize: '3em',
  margin: 0
} as const;

const subtitleStyles = {
  fontSize: '1.5em',
  margin: 0,
  opacity: 0.8
} as const;

const aboutStyles = {
  fontSize: '1.2em',
  maxWidth: '600px',
  textAlign: 'center',
  opacity: 0.6,
  margin: '20px 0'
} as const;

const Header: React.FC<HeaderProps> = ({ darkMode }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Preload images
  useEffect(() => {
    const preloadImages = (urls: string[]) => {
      urls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };

    preloadImages([...BACKGROUNDS.light, ...BACKGROUNDS.dark]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % BACKGROUNDS.light.length);
        setIsTransitioning(false);
      }, 500); // Half of the transition duration
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={containerStyles}>
      <div style={backgroundContainerStyles}>
        <img 
          src={darkMode ? BACKGROUNDS.dark[currentImageIndex] : BACKGROUNDS.light[currentImageIndex]}
          alt=""
          aria-hidden="true"
          style={{
            ...backgroundImageStyles,
            opacity: isTransitioning ? 0 : 0.1
          }}
        />
      </div>
      <div style={contentContainerStyles}>
        <h1 style={titleStyles}>
          {headerData.name}
        </h1>
        <h2 style={subtitleStyles}>
          {headerData.title}
        </h2>
        <p style={aboutStyles}>
          {headerData.about}
        </p>
      </div>
    </div>
  );
};

export default Header;
