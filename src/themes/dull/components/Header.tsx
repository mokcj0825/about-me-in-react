import React from 'react';
import { DULL_THEMES } from '../colors';
import { DULL_FONTS } from '../fonts';
import { HeaderType } from '../../../data/header.type';
import headerData from '../../../data/header.json';

interface DullHeaderProps {
  darkMode: boolean;
}

const DullHeader: React.FC<DullHeaderProps> = ({ darkMode }) => {
  const currentTheme = darkMode ? DULL_THEMES.DARK : DULL_THEMES.LIGHT;
  const header: HeaderType = headerData;

  const styles = {
    header: {
      padding: '60px 20px',
      textAlign: 'center' as const,
      background: currentTheme.background,
      color: currentTheme.text,
      borderBottom: `1px solid ${currentTheme.border}`,
      transition: 'all 0.2s ease',
    },
    name: {
      fontSize: '48px',
      fontFamily: DULL_FONTS.family,
      fontWeight: DULL_FONTS.weight.bold,
      marginBottom: '16px',
      letterSpacing: '-0.5px',
    },
    title: {
      fontSize: '24px',
      fontFamily: DULL_FONTS.family,
      color: currentTheme.secondary,
      marginBottom: '24px',
      fontWeight: DULL_FONTS.weight.normal,
    },
    about: {
      fontSize: '18px',
      fontFamily: DULL_FONTS.family,
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6',
      color: currentTheme.text,
    }
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.name}>{header.name}</h1>
      <h2 style={styles.title}>{header.title}</h2>
      <p style={styles.about}>{header.about}</p>
    </header>
  );
};

export default DullHeader;
