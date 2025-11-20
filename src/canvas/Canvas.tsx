import React, { useState } from 'react';
import ThemeContainer from '../themes/ThemeContainer';
import { ThemeType } from '../themes/ThemeType';
import { ProfileProvider } from '../services/ProfileContext';

const Canvas: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('dull');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ProfileProvider>
      <ThemeContainer 
        currentTheme={currentTheme}
        darkMode={darkMode}
        onDarkModeToggle={setDarkMode}
        onThemeChange={setCurrentTheme}
      />
    </ProfileProvider>
  );
};

export default Canvas;
