import React from 'react';
import headerData from '../../../data/header.json';

const BACKGROUNDS = {
    light: 'https://storage.googleapis.com/cj-mok-stash/20250127015020-bl.png',
    dark: 'https://storage.googleapis.com/cj-mok-stash/20250127015020-wl.png'
  };

  interface HeaderProps {
    darkMode: boolean;
  }
  
  const Header: React.FC<HeaderProps> = ({ darkMode }) => {
    return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url(${darkMode ? BACKGROUNDS.dark : BACKGROUNDS.light})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.05,
        zIndex: 0
      }} />
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px'
      }}>
        <h1 style={{ 
          fontSize: '3em',
          margin: 0
        }}>
          {headerData.name}
        </h1>
        <h2 style={{ 
          fontSize: '1.5em',
          margin: 0,
          opacity: 0.8
        }}>
          {headerData.title}
        </h2>
        <p style={{ 
          fontSize: '1.2em',
          maxWidth: '600px',
          textAlign: 'center',
          opacity: 0.6,
          margin: '20px 0'
        }}>
          {headerData.about}
        </p>
      </div>
    </div>
  );
};

export default Header;
