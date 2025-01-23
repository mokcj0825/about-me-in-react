import React from 'react';
import BaseDarkModeToggle, {DarkModeToggleProps} from "../../../canvas/components/DarkModeToggle/BaseDarkModeToggle";
import { DULL_THEMES } from '../colors';
import { DULL_FONTS } from '../fonts';

const DullDarkModeToggle: React.FC<DarkModeToggleProps> = (props) => {
  const currentTheme = props.darkMode ? DULL_THEMES.DARK : DULL_THEMES.LIGHT;

  const styles = {
    wrapper: {
      position: 'fixed' as const,
      top: '20px',
      right: '20px',
      zIndex: 1000,
      '@media (maxWidth: 768px)': {
        top: '10px',
        right: '100px',
      },
      '@media (maxWidth: 480px)': {
        right: '70px',
      }
    },
    toggle: {
      display: 'flex',
      alignItems: 'center',
      padding: '6px 12px',
      background: currentTheme.toggle.background,
      border: `1px solid ${currentTheme.border}`,
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: DULL_FONTS.size.normal,
      color: currentTheme.text,
      userSelect: 'none' as const,
      gap: '8px',
      width: '100px',
      fontFamily: DULL_FONTS.family,
      '@media (maxWidth: 768px)': {
        padding: '6px 12px',
        fontSize: '12px',
        gap: '6px'
      },
      '@media (maxWidth: 480px)': {
        padding: '6px 8px',
        // Hide text on very small screens
        '& span': {
          display: 'none'
        }
      }
    },
    circle: {
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      background: currentTheme.toggle.circle,
      transition: 'all 0.2s ease',
      '@media (maxWidth: 768px)': {
        width: '12px',
        height: '12px',
      }
    },
    text: {
      fontFamily: DULL_FONTS.family,
      fontSize: DULL_FONTS.size.normal,
      '@media (max-width: 480px)': {
        display: 'none'
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      <BaseDarkModeToggle
        {...props}
        style={styles.toggle}
      >
        <div style={styles.circle} />
        {props.darkMode ? 'Dark' : 'Light'}
      </BaseDarkModeToggle>
    </div>
  );
};

export default DullDarkModeToggle;
