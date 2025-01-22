import React from 'react';
import ClassicTheme from './themes/classic/ClassicTheme';
import HydroTheme from './themes/hydro/HydroTheme';
import CustomThemeSelector from './components/CustomThemeSelector';
import ThemeTransition from './components/ThemeTransition';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

export type ThemeName = 'classic' | 'hydro'; // We can add more themes later

const ThemeContent: React.FC = () => {
  const { currentTheme } = useTheme();

  const renderTheme = () => {
    switch (currentTheme) {
      case 'classic':
        return <ClassicTheme />;
      case 'hydro':
        return <HydroTheme />;
      default:
        return <ClassicTheme />;
    }
  };

  return (
    <>
      <CustomThemeSelector />
      <ThemeTransition theme={currentTheme}>
        {renderTheme()}
      </ThemeTransition>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ThemeContent />
    </ThemeProvider>
  );
};

export default App;