import React from 'react';
import { DULL_THEMES } from '../colors';
import { DULL_FONTS } from '../fonts';
import { useProfile } from '../../../services/ProfileContext';

interface DullHeaderProps {
  darkMode: boolean;
}

const DullHeader: React.FC<DullHeaderProps> = ({ darkMode }) => {
  const currentTheme = darkMode ? DULL_THEMES.DARK : DULL_THEMES.LIGHT;
  const { profile, loading, error } = useProfile();

  const styles = {
    header: {
      padding: '45px 20px',
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
      color: darkMode ? '#E0E0E0' : currentTheme.secondary,
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

  if (loading) {
    return (
      <header style={styles.header}>
        <p>Loading...</p>
      </header>
    );
  }

  if (error) {
    return (
      <header style={styles.header}>
        <p>Failed to load profile</p>
      </header>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <header style={styles.header}>
      <h1 style={styles.name}>{profile.name}</h1>
      <h2 style={styles.title}>{profile.title}</h2>
      <p style={styles.about}>{profile.bio}</p>
    </header>
  );
};

export default DullHeader;
