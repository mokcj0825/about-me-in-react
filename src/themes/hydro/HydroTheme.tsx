import React, {useState, useEffect} from 'react';
import './styles/hydro.css';
import ThemeToggle from "./components/ThemeToggle";
import Header from './components/Header';
import WaterBubble from "./components/WaterBubble";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Languages from "./components/Languages";
import Contact from "./components/Contact";

const HydroTheme: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    document.body.style.background = darkMode ? 'var(--hydro-secondary)' : 'var(--hydro-light)';
    
    return () => {
      document.body.style.background = '';
    };
  }, [darkMode]);

  return (
    <div className={`hydro-container ${darkMode ? 'dark' : ''}`}>
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="hydro-content">
        <Header name="Mok Cj" title="Software Developer" darkMode={darkMode}/>

        <div className="hydro-space">
          <div className="bubble-about">
            <WaterBubble title="About" darkMode={darkMode} bubbleSize={200}>
              <About darkMode={darkMode} />
            </WaterBubble>
          </div>

          <div className="bubble-skills">
            <WaterBubble title="Skills" darkMode={darkMode} bubbleSize={180}>
              <Skills darkMode={darkMode} />
            </WaterBubble>
          </div>

          <div className="bubble-projects">
            <WaterBubble title="Projects" darkMode={darkMode} bubbleSize={220}>
              <Projects darkMode={darkMode} />
            </WaterBubble>
          </div>

          <div className="bubble-languages">
            <WaterBubble title="Languages" darkMode={darkMode} bubbleSize={160}>
              <Languages darkMode={darkMode} />
            </WaterBubble>
          </div>

          <div className="bubble-contact">
            <WaterBubble title="Contact" darkMode={darkMode} bubbleSize={190}>
              <Contact darkMode={darkMode} />
            </WaterBubble>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HydroTheme;
