import React from 'react';
import BaseThemeContainer, { BaseThemeContainerProps } from '../../../canvas/components/ThemeContainer/BaseThemeContainer';
import { HYDRO_THEMES } from '../colors';
import { HYDRO_FONTS } from '../fonts';
import HydroThemeSelector from './HydroThemeSelector';
import HydroDarkModeToggle from './HydroDarkModeToggle';
import {ThemeType} from "../../ThemeType";
import HydroRippleEffect from './HydroRippleEffect';

interface HydroThemeContainerProps extends Omit<BaseThemeContainerProps, 'theme'> {
  onDarkModeToggle: (isDark: boolean) => void;
  onThemeChange: (theme: ThemeType) => void;
}

const HydroThemeContainer: React.FC<HydroThemeContainerProps> = ({
  darkMode, 
  onDarkModeToggle,
  onThemeChange,
  children,
  ...props 
}) => {
  const currentTheme = darkMode ? HYDRO_THEMES.DARK : HYDRO_THEMES.LIGHT;

  const styles = {
    container: {
      background: currentTheme.background,
      color: currentTheme.text,
      borderColor: currentTheme.border,
      fontFamily: HYDRO_FONTS.family,
      fontSize: HYDRO_FONTS.size.normal,
      minHeight: '100vh',
      transition: 'all 0.2s ease',
      padding: '20px',
      position: 'relative' as const,
      overflow: 'hidden'
    }
  };

  return (
    <BaseThemeContainer
      theme="hydro"
      darkMode={darkMode}
      style={{ ...styles.container, ...props.style }}
      {...props}
    >
      <HydroRippleEffect 
        color={darkMode ? 'rgba(128, 128, 192, 0.2)' : 'rgba(0, 0, 255, 0.1)'}
      />
      <HydroThemeSelector currentTheme={darkMode ? 'dark' : 'light'} onThemeChange={onThemeChange} />
      <HydroDarkModeToggle darkMode={darkMode} onToggle={onDarkModeToggle} />
      {children}
    </BaseThemeContainer>
  );
};

export default HydroThemeContainer;
