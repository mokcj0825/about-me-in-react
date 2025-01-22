import React from 'react';

interface AboutProps {
  darkMode?: boolean;
}

const About: React.FC<AboutProps> = ({ darkMode }) => {
  const styles = {
    container: {
      color: darkMode ? '#ffffff' : '#008b8b',
      padding: '3rem 4rem 3rem 3rem',
      borderRadius: '20px',
      textShadow: darkMode
        ? '0 1px 2px rgba(0, 0, 0, 0.5)'
        : '0 1px 2px rgba(0, 0, 0, 0.3)',
      fontFamily: "'Parisienne', cursive",
      fontSize: '1.2rem',
      position: 'relative', // For positioning the instruction text
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
      <h2 style={styles.heading}>About Me</h2>
      <p>
        Hello! I'm <span style={styles.highlight}>Mok Cj</span>, a passionate 
        software developer dedicated to creating innovative solutions through code. 
        With a keen interest in web development and user experience, I strive to 
        build applications that make a difference.
      </p>
      <div style={styles.closeInstruction}>
        Cliquez à l'extérieur pour fermer
      </div>
    </div>
  );
};

export default About;
