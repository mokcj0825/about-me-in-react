import React, { useState, useEffect } from 'react';
import Book from "./language-proficiency/book";

interface LanguageProficiencyProps {
  darkMode: boolean;
}

const containerStyles = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '40px',
  position: 'relative',
  overflow: 'hidden'
} as const;

const bookContainerStyles = {
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

const BACKGROUNDS = {
  light: [
    'https://storage.googleapis.com/cj-mok-stash/fontaine20-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine21-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine22-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine23-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine24-bl.png'
  ],
  dark: [
    'https://storage.googleapis.com/cj-mok-stash/fontaine20-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine21-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine22-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine23-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine24-wl.png'
  ]
};

const LanguageProficiency: React.FC<LanguageProficiencyProps> = ({ darkMode }) => {
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
      <div style={bookContainerStyles}>
        <img
          src={darkMode ? BACKGROUNDS.dark[currentImageIndex] : BACKGROUNDS.light[currentImageIndex]}
          alt=""
          aria-hidden="true"
          style={{
            ...backgroundImageStyles,
            opacity: isTransitioning ? 0 : 0.1
          }}
        />
        <div style={containerStyles}>
          <Book darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default LanguageProficiency;
