import React, { useState } from 'react';

interface Props {
  darkMode: boolean;
}

const HydroRedirections: React.FC<Props> = ({darkMode}: Props) => {
  const [displayText, setDisplayText] = useState('Other places');

  const styles = {
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
    },
    displayBar: {
      fontSize: '1.5rem',
      color: darkMode ? '#fff' : '#000',
      textAlign: 'center' as const,
      padding: '20px',
      transition: 'all 0.3s ease',
    },
    linksContainer: {
      display: 'flex',
      gap: '40px',
      marginTop: 'auto',
    },
    link: {
      cursor: 'pointer',
      padding: '10px 20px',
      borderRadius: '8px',
      background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      color: darkMode ? '#fff' : '#000',
      transition: 'all 0.2s ease',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.displayBar}>
        {displayText}
      </div>
      <div style={styles.linksContainer}>
        <div 
          style={styles.link}
          onClick={() => window.location.href = '/stash'}
          onMouseEnter={() => setDisplayText('You can take a look on what I did.')}
          onMouseLeave={() => setDisplayText('Other places')}
        >
          Stash
        </div>
        <div 
          style={styles.link}
          onClick={() => window.location.href = '/labs'}
          onMouseEnter={() => setDisplayText('You can take a look on what I test.')}
          onMouseLeave={() => setDisplayText('Other places')}
        >
          Labs
        </div>
      </div>
    </div>
  );
}

export default HydroRedirections;