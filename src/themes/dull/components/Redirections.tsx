import React from 'react';
import { DULL_THEMES } from '../colors';
import { DULL_FONTS } from '../fonts';

interface Props {
    darkMode: boolean;
}

const DullRedirection: React.FC<Props> = ({ darkMode }) => {
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
      linksGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        padding: '0 20px',
      },
      linkCard: {
        background: currentTheme.background,
        border: `1px solid ${currentTheme.border}`,
        borderRadius: '8px',
        padding: '20px',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center' as const,
        gap: '10px',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 8px ${darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
        }
      },
      linkCardDummy: {
        background: currentTheme.background,
        borderRadius: '8px',
        padding: '20px',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center' as const,
        gap: '10px',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 8px ${darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
        }
      },
      linkText: {
        fontSize: '24px',
        color: currentTheme.text,
        fontFamily: DULL_FONTS.family,
        marginBottom: '8px',
      },
      description: {
        fontSize: '16px',
        color: currentTheme.text,
        opacity: 0.8,
        fontFamily: DULL_FONTS.family,
      },
      contactInfo: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '4px',
      },
      contactLink: {
        color: currentTheme.text,
        textDecoration: 'none',
        transition: 'opacity 0.2s ease',
        '&:hover': {
          opacity: 0.7,
        }
      }
    };
  
    return (
      <section style={styles.container}>
        <h2 style={styles.title}>Anything else?</h2>
        <div style={styles.linksGrid}>
          <div
            style={styles.linkCard}
            onClick={() => window.location.href = '/stash'}
          >
            <h3 style={styles.linkText}>Stash</h3>
            <p style={styles.description}>You can take a look on what I did.</p>
          </div>
          <div
            style={styles.linkCard}
            onClick={() => window.location.href = '/labs'}
          >
            <h3 style={styles.linkText}>Labs</h3>
            <p style={styles.description}>You can take a look on what I test.</p>
          </div>
          <div
            style={styles.linkCard}
            onClick={() => window.location.href = 'https://core.cjmok.com/'}
          >
            <h3 style={styles.linkText}>Core</h3>
            <p style={styles.description}>Core here.</p>
          </div>
          <div
            style={styles.linkCardDummy}
          >
          </div>
          <div style={styles.linkCard}>
            <h3 style={styles.linkText}>Contact</h3>
            <div style={styles.contactInfo}>
              <p style={styles.description}>
                <a href="mailto:mokcjmok@gmail.com" style={styles.contactLink}>
                  Email: mokcjmok@gmail.com
                </a>
              </p>
              <p style={styles.description}>
                <a href="https://github.com/mokcj0825" target="_blank" rel="noopener noreferrer"
                   style={styles.contactLink}>
                  Github: github/mokcj0825
                </a>
              </p>
              <p style={styles.description}>
                <a href="https://www.linkedin.com/in/cj-mok-52907642/" target="_blank" rel="noopener noreferrer"
                   style={styles.contactLink}>
                  LinkedIn: linkedin/cj-mok-52907642
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
}

export default DullRedirection;