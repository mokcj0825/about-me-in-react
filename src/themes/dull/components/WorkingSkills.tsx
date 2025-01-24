import React from 'react';
import { DULL_THEMES } from '../colors';
import { DULL_FONTS } from '../fonts';
import workingSkills from '../../../data/working-skills.json';

interface DullWorkingSkillsProps {
  darkMode: boolean;
}

const DullWorkingSkills: React.FC<DullWorkingSkillsProps> = ({ darkMode }) => {
  const currentTheme = darkMode ? DULL_THEMES.DARK : DULL_THEMES.LIGHT;

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
    skillsGrid: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '12px',
      justifyContent: 'center',
    },
    skill: {
      background: currentTheme.secondary,
      color: currentTheme.text,
      padding: '8px 16px',
      borderRadius: '4px',
      fontSize: DULL_FONTS.size.normal,
      fontFamily: DULL_FONTS.family,
      border: `1px solid ${currentTheme.border}`,
      transition: 'all 0.2s ease',
      cursor: 'default',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 8px ${darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
      }
    }
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>Working Skills</h2>
      <div style={styles.skillsGrid}>
        {workingSkills.map((skill, index) => (
          <div key={index} style={styles.skill}>
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
};

export default DullWorkingSkills;
