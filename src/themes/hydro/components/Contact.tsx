import React from 'react';

interface ContactProps {
  darkMode?: boolean;
}

const Contact: React.FC<ContactProps> = ({ darkMode }) => {
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
      <h2 style={styles.heading}>Contact</h2>
      <p>
        Feel free to reach out through any of these <span style={styles.highlight}>channels</span>:
      </p>
      <ul>
        <li>
          <span style={styles.highlight}>Email</span>
          <br />
          nishida.kai@example.com
        </li>
        <li>
          <span style={styles.highlight}>LinkedIn</span>
          <br />
          linkedin.com/in/nishidakai
        </li>
        <li>
          <span style={styles.highlight}>GitHub</span>
          <br />
          github.com/nishidakai
        </li>
        <li>
          <span style={styles.highlight}>Twitter</span>
          <br />
          @nishidakai
        </li>
      </ul>
      <div style={styles.closeInstruction}>
        Cliquez à l'extérieur pour fermer
      </div>
    </div>
  );
};

export default Contact; 