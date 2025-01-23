import React, { useState } from 'react';
import {ThemeSelectorProps} from "../../../canvas/components/ThemeSelector/BaseThemeSelector";
import { DULL_THEMES } from '../colors';
import { DULL_FONTS } from '../fonts';
import { AVAILABLE_THEMES, ThemeType } from '../../ThemeType';

const DullThemeSelector: React.FC<ThemeSelectorProps> = (props) => {
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const currentTheme = props.currentTheme === 'dark' ? DULL_THEMES.DARK : DULL_THEMES.LIGHT;

  const styles = {
    wrapper: {
      position: 'fixed' as const,
      top: '20px',
      left: '20px',
      zIndex: 1000,
      '@media (maxWidth: 768px)': {
        top: '10px',
        right: '10px',
      }
    },
    button: {
      background: currentTheme.selector.background,
      border: `1px solid ${currentTheme.border}`,
      color: currentTheme.text,
      fontFamily: DULL_FONTS.family,
      fontSize: DULL_FONTS.size.normal,
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '@media (maxWidth: 768px)': {
        padding: '6px 12px',
        fontSize: '12px',
      }
    },
    selectionPanel: {
      position: 'absolute' as const,
      top: '100%',
      left: '0',
      marginTop: '10px',
      background: currentTheme.selector.background,
      border: `1px solid ${currentTheme.border}`,
      borderRadius: '4px',
      padding: '16px',
      boxShadow: `0 2px 10px ${props.currentTheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
      display: isSelectionOpen ? 'block' : 'none',
      minWidth: '200px',
      '@media (maxWidth: 768px)': {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '300px',
        minWidth: 'auto',
      }
    },
    themeOption: {
      padding: '8px 16px',
      margin: '4px 0',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'background 0.2s ease',
      fontFamily: DULL_FONTS.family,
      fontSize: DULL_FONTS.size.normal,
      color: currentTheme.text,
      '&:hover': {
        background: currentTheme.selector.hover,
      },
      '@media (maxWidth: 768px)': {
        padding: '12px 16px', // Larger touch target on mobile
      }
    },
    cancelButton: {
      background: 'none',
      border: 'none',
      color: currentTheme.text,
      padding: '8px',
      marginTop: '8px',
      cursor: 'pointer',
      fontFamily: DULL_FONTS.family,
      fontSize: DULL_FONTS.size.small,
      width: '100%',
      textAlign: 'center' as const,
      '@media (maxWidth: 768px)': {
        padding: '12px',
        fontSize: '14px',
      }
    }
  };

  const toggleSelection = () => {
    setIsSelectionOpen(!isSelectionOpen);
  };

  const handleThemeSelect = (theme: string) => {
    props.onThemeChange(theme);
    setIsSelectionOpen(false);
  };

  return (
    <div style={styles.wrapper}>
      <button style={styles.button} onClick={toggleSelection}>
        Other themes?
      </button>

      <div style={styles.selectionPanel}>
        {AVAILABLE_THEMES.map(theme => (
          <div 
            key={theme}
            style={styles.themeOption}
            onClick={() => handleThemeSelect(theme)}
          >
            {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
          </div>
        ))}
        <button 
          style={styles.cancelButton}
          onClick={() => setIsSelectionOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DullThemeSelector;
