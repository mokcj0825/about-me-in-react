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
      cursor: 'pointer',
      position: 'relative' as const,
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 8px ${darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
      }
    },
    tooltip: {
      position: 'absolute' as const,
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      background: currentTheme.primary,
      color: currentTheme.text,
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: DULL_FONTS.size.small,
      whiteSpace: 'nowrap' as const, 
      visibility: 'hidden' as const,
      opacity: 0,
      transition: 'all 0.2s ease',
      zIndex: 1,
      marginBottom: '8px', 
    },
    skillContainer: {
      position: 'relative' as const,
      '&:hover .tooltip': {
        visibility: 'visible',
        opacity: 1,
      }
    }
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>Working Skills</h2>
      <div style={styles.skillsGrid}>
        {workingSkills.map((skill, index) => (
          <div key={index} 
               onMouseEnter={e => {
                 const tooltip = e.currentTarget.querySelector('.tooltip');
                 if (tooltip) {
                   (tooltip as HTMLElement).style.visibility = 'visible';
                   (tooltip as HTMLElement).style.opacity = '1';
                 }
               }}
               onMouseLeave={e => {
                 const tooltip = e.currentTarget.querySelector('.tooltip');
                 if (tooltip) {
                   (tooltip as HTMLElement).style.visibility = 'hidden';
                   (tooltip as HTMLElement).style.opacity = '0';
                 }
               }}
               style={styles.skillContainer}>
            <div style={styles.skill}>
              {skill.skills}
            </div>
            <div className="tooltip" style={styles.tooltip}>
              {skill.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DullWorkingSkills;
