import React, { useState } from 'react';
import ThemeContainer from '../themes/ThemeContainer';
import { ThemeType } from '../themes/ThemeType';

const Canvas: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('dull');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeContainer 
      currentTheme={currentTheme}
      darkMode={darkMode}
      onDarkModeToggle={setDarkMode}
      onThemeChange={setCurrentTheme}
    />
  );
};

export default Canvas;
