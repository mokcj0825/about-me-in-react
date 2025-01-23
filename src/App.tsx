import React, { useState } from 'react';
import Canvas from './canvas/Canvas';
import ThemeContainer from "./themes/ThemeContainer";
import { ThemeType } from './themes/ThemeType';


const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('dull');
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeChange = (theme: ThemeType) => {
    setCurrentTheme(theme);
  };

  return (
    <Canvas>
      <ThemeContainer 
        currentTheme={currentTheme}
        darkMode={darkMode}
        onDarkModeToggle={setDarkMode}
        onThemeChange={handleThemeChange}
      />
    </Canvas>
  );
};

export default App;