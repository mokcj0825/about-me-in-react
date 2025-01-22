import React from 'react';

interface SkillsProps {
  darkMode?: boolean;
}

const Skills: React.FC<SkillsProps> = ({ darkMode }) => {
  const styles = {
    container: {
      color: darkMode ? '#ffffff' : '#008b8b',
      padding: '3rem 4rem 3rem 3rem',
      textShadow: darkMode
        ? '0 1px 2px rgba(0, 0, 0, 0.5)'
        : '0 1px 2px rgba(0, 0, 0, 0.3)',
      fontFamily: "'Parisienne', cursive",
      fontSize: '1.2rem',
      position: 'relative',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    },
    heading: {
      color: darkMode 
        ? 'rgb(173, 216, 255)' 
        : '#006666',
      fontSize: '3.5rem',
      marginLeft: '-0.5rem',
      transition: 'color 0.3s ease',
      textShadow: darkMode
        ? '0 2px 4px rgba(0, 0, 0, 0.5), 0 -1px 1px rgba(255, 255, 255, 0.2)'
        : '0 2px 4px rgba(0, 0, 0, 0.3), 0 -1px 1px rgba(255, 255, 255, 0.3)',
      fontWeight: 400,
    },
    highlight: {
      color: darkMode 
        ? 'rgb(173, 216, 255)' 
        : '#006666',
      transition: 'color 0.3s ease',
      textShadow: darkMode
        ? '0 1px 3px rgba(0, 0, 0, 0.5), 0 -1px 1px rgba(255, 255, 255, 0.2)'
        : '0 1px 3px rgba(0, 0, 0, 0.3), 0 -1px 1px rgba(255, 255, 255, 0.3)',
      fontWeight: 400,
      fontSize: '1.4em',
    },
    closeInstruction: {
      position: 'absolute',
      bottom: '1rem',
      right: '1.5rem',
      fontSize: '0.9rem',
      opacity: 0.7,
      fontStyle: 'italic',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Skills</h2>
      <p>
        Proficient in <span style={styles.highlight}>web development</span> with expertise in 
        modern frameworks and libraries. Strong background in 
        <span style={styles.highlight}> full-stack development</span>, including:
      </p>
      <ul>
        <li>Frontend Development (React, Vue.js)</li>
        <li>Backend Development (Node.js, Python)</li>
        <li>Database Management (SQL, MongoDB)</li>
        <li>Cloud Services (AWS, Azure)</li>
        <li>DevOps & CI/CD</li>
      </ul>
      <div style={styles.closeInstruction}>
        Cliquez à l'extérieur pour fermer
      </div>
    </div>
  );
};

export default Skills; 