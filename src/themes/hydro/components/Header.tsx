import React, { useEffect } from 'react';

interface HeaderProps {
  name: string;
  title: string;
  darkMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ name, title, darkMode = false }) => {
  const headerStyle: React.CSSProperties = {
    padding: '2rem',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    marginTop: '1rem',
    color: darkMode ? 'var(--hydro-light)' : 'var(--hydro-secondary)',
    opacity: 0.9,
    fontWeight: 500,
    letterSpacing: '0.05em',
    transition: 'all 0.3s ease'
  };

  const nameStyle: React.CSSProperties = {
    fontSize: '3.5rem',
    fontWeight: 700,
    margin: 0,
    background: 'linear-gradient(135deg, var(--hydro-primary), var(--hydro-accent))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    transition: 'all 0.3s ease'
  };

  const underlineContainerStyle: React.CSSProperties = {
    width: '200px',
    height: '20px',
    margin: '1rem auto',
    position: 'relative'
  };

  useEffect(() => {
    try {
      const styleSheet = document.styleSheets[0];
      const keyframes = `
        @keyframes ekg {
          0% {
            opacity: 0;
            stroke-dashoffset: 1000;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            opacity: 0;
            stroke-dashoffset: -1000;
          }
        }
      `;

      // Check if animation already exists
      const exists = Array.from(styleSheet.cssRules).some(
        rule => rule.type === CSSRule.KEYFRAMES_RULE && (rule as CSSKeyframesRule).name === 'ekg'
      );

      if (!exists) {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
      }
    } catch (error) {
      console.warn('Failed to insert keyframe animation:', error);
    }
  }, []);

  return (
    <header style={headerStyle}>
      <h1 style={nameStyle}>{name}</h1>
      <p style={titleStyle}>
        {title}
        <div style={underlineContainerStyle}>
          <svg
            viewBox="0 0 200 20"
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <path
              d="M0,10 C10,10 15,5 20,10 C25,15 30,5 35,10 C40,15 45,5 50,10 C55,15 60,5 65,10 C70,15 75,5 80,10 C85,15 90,5 95,10 C100,15 105,5 110,10 C115,15 120,5 125,10 C130,15 135,5 140,10 C145,15 150,5 155,10 C160,15 165,5 170,10 C175,15 180,5 185,10 C190,15 195,5 200,10"
              style={{
                fill: 'none',
                stroke: 'var(--hydro-primary)',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                opacity: 0,
                strokeDasharray: '1000',
                strokeDashoffset: '1000',
                animation: 'ekg 4s linear infinite',
                filter: 'drop-shadow(0 0 2px var(--hydro-primary))'
              }}
            />
          </svg>
        </div>
      </p>
    </header>
  );
};

export default Header;