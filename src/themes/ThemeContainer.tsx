import React from 'react';
import DullThemeContainer from './dull/components/DullThemeContainer';
import HydroThemeContainer from './hydro/components/HydroThemeContainer';
import SynthwaveRetroverseContainer from './synthwave-retroverse/components/SynthwaveRetroverseContainer';
import { ThemeType } from './ThemeType';

interface ThemeContainerProps {
  currentTheme: ThemeType;
  darkMode: boolean;
  onDarkModeToggle: (isDark: boolean) => void;
  onThemeChange: (theme: ThemeType) => void;
}

const ThemeContainer: React.FC<ThemeContainerProps> = ({
  currentTheme,
  darkMode,
  onDarkModeToggle,
  onThemeChange
}) => {
  const renderThemeContainer = () => {
    switch(currentTheme) {
      case 'synthwave-retroverse':
        return <SynthwaveRetroverseContainer
          darkMode={darkMode}
          onDarkModeToggle={onDarkModeToggle}
          onThemeChange={onThemeChange}
        />;
      case 'hydro':
        return <HydroThemeContainer 
          darkMode={darkMode} 
          onDarkModeToggle={onDarkModeToggle}
          onThemeChange={onThemeChange}
        />;
      case 'dull':
      default:
        return <DullThemeContainer 
          darkMode={darkMode} 
          onDarkModeToggle={onDarkModeToggle}
          onThemeChange={onThemeChange}
        />;
    }
  };

  return renderThemeContainer();
};

export default ThemeContainer;