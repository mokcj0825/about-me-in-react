import React, { useState } from 'react';
import { DULL_THEMES } from '../colors';
import { DULL_FONTS } from '../fonts';
import languageProficiency from '../../../data/language-proficiency.json';

interface DullLanguageProficiencyProps {
  darkMode: boolean;
}

const DullLanguageProficiency: React.FC<DullLanguageProficiencyProps> = ({ darkMode }) => {
  const currentTheme = darkMode ? DULL_THEMES.DARK : DULL_THEMES.LIGHT;
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);

  const styles = {
    container: {
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    title: {
      fontSize: '32px',
      fontFamily: DULL_FONTS.family,
      color: currentTheme.text,
      marginBottom: '24px',
      textAlign: 'center' as const,
    },
    languageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '20px',
      padding: '0 20px',
    },
    languageCard: {
      position: 'relative' as const,
      background: currentTheme.background,
      border: `1px solid ${currentTheme.border}`,
      borderRadius: '8px',
      padding: '20px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center', 
      alignItems: 'center', 
      textAlign: 'center' as const,
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 8px ${darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
      }
    },
    languageName: {
      fontSize: '24px',
      color: currentTheme.text,
      fontFamily: DULL_FONTS.family,
    },
    tooltip: {
      position: 'absolute' as const,
      top: '0',
      left: '50%',
      transform: 'translateX(-50%) translateY(-100%)',
      background: currentTheme.primary,
      color: '#fff',
      padding: '12px 16px',
      borderRadius: '4px',
      fontSize: DULL_FONTS.size.normal,
      whiteSpace: 'pre-wrap' as const,
      width: '100%',
      textAlign: 'center' as const,
      opacity: 0,
      visibility: 'hidden' as const,
      transition: 'opacity 0.2s ease, visibility 0.2s ease',
      zIndex: 1000,
      marginTop: '-8px',
      boxShadow: `0 4px 8px ${darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
      ...(hoveredLanguage && { opacity: 1, visibility: 'visible' as const })
    }
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>Language Proficiency</h2>
      <div style={styles.languageGrid}>
        {languageProficiency.map((language, index) => (
          <div 
            key={index} 
            style={styles.languageCard}
            onMouseEnter={() => setHoveredLanguage(language.language)}
            onMouseLeave={() => setHoveredLanguage(null)}
          >
            {hoveredLanguage === language.language && (
              <div style={styles.tooltip}>
                {language.description}
              </div>
            )}
            <h3 style={styles.languageName}>{language.language}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DullLanguageProficiency;
