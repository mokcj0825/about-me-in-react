import React, { useEffect, useState } from 'react';
import BaseThemeContainer, { BaseThemeContainerProps } from '../../../canvas/components/ThemeContainer/BaseThemeContainer';
import { HYDRO_THEMES } from '../colors';
import { HYDRO_FONTS, loadHydroFont } from '../fonts';
import HydroThemeSelector from './HydroThemeSelector';
import HydroDarkModeToggle from './HydroDarkModeToggle';
import {ThemeType} from "../../ThemeType";
import HydroRippleEffect from './HydroRippleEffect';
import Header from './Header';
import WorkingSkills from './WorkingSkills';
import LanguageProficiency from "./LanguageProficiency";
import HydroRedirections from "./Redirections";
import HydroContracts from "./HydroContracts";

interface HydroThemeContainerProps extends Omit<BaseThemeContainerProps, 'theme'> {
  onDarkModeToggle: (isDark: boolean) => void;
  onThemeChange: (theme: ThemeType) => void;
}

const HydroThemeContainer: React.FC<HydroThemeContainerProps> = ({
  darkMode, 
  onDarkModeToggle,
  onThemeChange,
  children,
  ...props 
}) => {
  const currentTheme = darkMode ? HYDRO_THEMES.DARK : HYDRO_THEMES.LIGHT;
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    loadHydroFont();
  }, []);

  useEffect(() => {
    // Create observer for sections
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const sectionIndex = parseInt(sectionId.split('-')[1]);
          setActiveSection(sectionIndex);
        }
      });
    }, {
      threshold: 0.5 // Trigger when section is 50% visible
    });

    // Observe all sections
    document.querySelectorAll('[id^="section-"]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <BaseThemeContainer
      theme="hydro"
      darkMode={darkMode}
      style={{ 
        background: currentTheme.background,
        color: currentTheme.text,
        borderColor: currentTheme.border,
        fontFamily: HYDRO_FONTS.family,
        fontSize: HYDRO_FONTS.size.normal,
        minHeight: '100vh',
        height: '100vh',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        padding: 0
      }}
      {...props}
    >
      <HydroRippleEffect 
        color={darkMode ? 'rgba(128, 128, 192, 0.2)' : 'rgba(0, 0, 255, 0.1)'}
      />

      <div style={{
        position: 'fixed',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        zIndex: 1002
      }}>
        {['Headers', 'Working Skills', 'Language Proficiency', 'Redirections', 'Contacts'].map((section, index) => (
          <div 
            key={section}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: currentTheme.text,
              opacity: activeSection === index ? 1 : 0.5,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: `scale(${activeSection === index ? 1.2 : 1})`,
            }}
            onClick={() => {
              document.getElementById(`section-${index}`)?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
              });
            }}
            title={section}
          />
        ))}
      </div>
      <div style={{ 
        width: '100%', 
        height: '100vh',
        overflow: 'auto',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth'
      }}>
        <div id="section-0" style={{
          height: '100vh',
          width: '100%',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always'
        }}>
          <Header darkMode={darkMode} />
        </div>
        <div id="section-1" style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2em',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always'
        }}>
          <WorkingSkills darkMode={darkMode} />
        </div>
        <div id="section-2" style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2em',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always'
        }}>
          <LanguageProficiency darkMode={darkMode} />
        </div>
        <div id="section-3" style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2em',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always'
        }}>
          <HydroRedirections darkMode={darkMode} />
        </div>
        <div id="section-4" style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2em',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always'
        }}>
          <HydroContracts darkMode={darkMode} />
        </div>
      </div>
      <HydroThemeSelector 
        currentTheme={darkMode ? 'dark' : 'light'} 
        onThemeChange={onThemeChange} 
      />
      <HydroDarkModeToggle 
        darkMode={darkMode} 
        onToggle={onDarkModeToggle} 
      />
      {children}
    </BaseThemeContainer>
  );
};

export default HydroThemeContainer;
