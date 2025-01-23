import React from 'react';
import BaseThemeContainer, { BaseThemeContainerProps } from '../../../canvas/components/ThemeContainer/BaseThemeContainer';
import { DULL_THEMES } from '../colors';
import { DULL_FONTS } from '../fonts';
import DullThemeSelector from './DullThemeSelector';
import DullDarkModeToggle from './DullDarkModeToggle';
import {ThemeType} from "../../ThemeType";

interface DullThemeContainerProps extends Omit<BaseThemeContainerProps, 'theme'> {
  onDarkModeToggle: (isDark: boolean) => void;
  onThemeChange: (theme: ThemeType) => void;
}

const DullThemeContainer: React.FC<DullThemeContainerProps> = ({ 
  darkMode, 
  onDarkModeToggle,
  onThemeChange,
  children,
  ...props 
}) => {
  const currentTheme = darkMode ? DULL_THEMES.DARK : DULL_THEMES.LIGHT;

  const styles = {
    container: {
      background: currentTheme.background,
      color: currentTheme.text,
      borderColor: currentTheme.border,
      fontFamily: DULL_FONTS.family,
      fontSize: DULL_FONTS.size.normal,
      minHeight: '100vh',
      transition: 'all 0.2s ease',
      padding: '20px'
    }
  };

  return (
    <BaseThemeContainer
      theme="dull"
      darkMode={darkMode}
      style={{ ...styles.container, ...props.style }}
      {...props}
    >
      <DullThemeSelector currentTheme={darkMode ? 'dark' : 'light'} onThemeChange={onThemeChange} />
      <DullDarkModeToggle darkMode={darkMode} onToggle={onDarkModeToggle} />
      {children}
    </BaseThemeContainer>
  );
};

export default DullThemeContainer;
