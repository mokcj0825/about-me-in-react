import React from 'react';
import BaseThemeContainer, { BaseThemeContainerProps } from '../../../canvas/components/ThemeContainer/BaseThemeContainer';
import { DULL_THEMES } from '../colors';
import { DULL_FONTS } from '../fonts';
import DullThemeSelector from './DullThemeSelector';
import DullDarkModeToggle from './DullDarkModeToggle';
import DullHeader from './Header';
import { ThemeType } from '../../ThemeType';
import DullWorkingSkills from './WorkingSkills';
import DullLanguageProficiency from './LanguageProficiency';
import DullRedirection from './Redirections';

interface DullThemeContainerProps extends Omit<BaseThemeContainerProps, 'theme'> {
  onDarkModeToggle: (isDark: boolean) => void;
  onThemeChange: (theme: ThemeType) => void;
}

const DullThemeContainer: React.FC<DullThemeContainerProps> = ({ 
  darkMode, 
  onDarkModeToggle,
  onThemeChange,
  children 
}) => {
  const currentTheme = darkMode ? DULL_THEMES.DARK : DULL_THEMES.LIGHT;

  const styles = {
    container: {
      background: currentTheme.background,
      color: currentTheme.text,
      borderColor: currentTheme.border,
      fontFamily: DULL_FONTS.family,
      fontSize: DULL_FONTS.size.normal,
      height: '100vh',
      overflow: 'hidden' as const,
      transition: 'all 0.2s ease',
    },
    content: {
      height: '100%',
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const,
    }
  };

  return (
    <BaseThemeContainer
      theme="dull"
      darkMode={darkMode}
      style={styles.container}
    >
      <div style={styles.content}>
        <DullHeader darkMode={darkMode} />
        <DullWorkingSkills darkMode={darkMode} />
        <DullLanguageProficiency darkMode={darkMode} />
        <DullRedirection darkMode={darkMode} />

        <DullThemeSelector currentTheme={darkMode ? 'dark' : 'light'} onThemeChange={onThemeChange} />
        <DullDarkModeToggle darkMode={darkMode} onToggle={onDarkModeToggle} />
        {children}
      </div>
    </BaseThemeContainer>
  );
};

export default DullThemeContainer;
