import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, setDarkMode }) => {
  const toggleStyle: React.CSSProperties = {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    width: '40px',
    height: '40px',
    padding: '0.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    borderRadius: '50%',
    color: darkMode ? 'var(--hydro-light)' : '#727272',
    cursor: 'pointer',
    background: darkMode 
      ? 'radial-gradient(98.54% 109.61% at 73.57% -7.45%, var(--hydro-secondary) 0%, rgba(20, 40, 80, 0.6) 75%)'
      : 'radial-gradient(98.54% 109.61% at 73.57% -7.45%, #CCC 0%, rgba(237, 237, 237, 0.6) 75%)',
    boxShadow: darkMode
      ? `
        4px -4px 9.6px 0px rgba(20, 40, 80, 0.08) inset,
        2px -2px 9px 0px rgba(0, 0, 0, 0.16) inset,
        1px -1px 9.4px 0px rgba(0, 0, 0, 0.20) inset,
        -4px 5px 6.7px 1px rgba(0, 0, 0, 0.55),
        -3px 4px 9.2px 0px rgba(0, 0, 0, 0.60) inset
      `
      : `
        4px -4px 9.6px 0px rgba(86, 86, 86, 0.08) inset,
        2px -2px 9px 0px rgba(0, 0, 0, 0.16) inset,
        1px -1px 9.4px 0px rgba(0, 0, 0, 0.20) inset,
        -4px 5px 6.7px 1px rgba(0, 0, 0, 0.55),
        -3px 4px 9.2px 0px rgba(0, 0, 0, 0.60) inset
      `,
    backdropFilter: 'blur(1px)',
    transition: 'all 0.3s ease',
    overflow: 'hidden'
  };

  const arcStyle: React.CSSProperties = {
    position: 'absolute',
    top: '2px',
    right: '-14px',
    width: '4px',
    height: '4px',
    background: 'transparent',
    borderRadius: '200%',
    border: '1.5px solid rgba(255, 255, 255, 0.8)',
    borderBottom: 'none',
    pointerEvents: 'none',
    opacity: darkMode ? 0.4 : 0.8
  };

  return (
    <button 
      style={toggleStyle}
      onClick={() => setDarkMode(!darkMode)}
      aria-label="Toggle theme"
    >
      <div style={arcStyle} />
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default ThemeToggle; 