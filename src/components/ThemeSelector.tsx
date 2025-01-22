import React from 'react';
import { ThemeName } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeSelector.css';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setCurrentTheme } = useTheme();

  const getThemeSpecificClass = () => {
    switch (currentTheme) {
      case 'hydro':
        return 'theme-selector-hydro';
      case 'classic':
        return 'theme-selector-classic';
      default:
        return 'theme-selector-classic';
    }
  };

  return (
    <div className={`theme-selector ${getThemeSpecificClass()}`}>
      <select 
        value={currentTheme}
        onChange={(e) => setCurrentTheme(e.target.value as ThemeName)}
      >
        <option value="classic">Classic Theme</option>
        <option value="hydro">Hydro Theme</option>
      </select>
    </div>
  );
};

export default ThemeSelector; 