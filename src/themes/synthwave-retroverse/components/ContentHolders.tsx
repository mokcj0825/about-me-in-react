import React, { useState } from 'react';
import styled from 'styled-components';
import { SYNTHWAVE_RETROVERSE_THEMES } from '../colors';
import { SYNTHWAVE_RETROVERSE_FONTS } from '../fonts';
import HologramDialog from './HologramDialog';
import WorkingSkills from './sections/WorkingSkills';
import LanguageProficiency from './sections/LanguageProficiency';
import Redirections from './sections/Redirections';
import Contacts from './sections/Contacts';

interface ContentHoldersProps {
  darkMode: boolean;
}

interface StyledProps {
  darkMode: boolean;
  isActive?: boolean;
  isExpanded?: boolean;
}

const Container = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 0;
  width: 100%;
  height: ${({ isExpanded }) => isExpanded ? '100%' : 'auto'};
  position: relative;
  transition: all 0.5s ease;
  z-index: ${({ isExpanded }) => isExpanded ? '1001' : '1'};
`;

const HoldersRow = styled.div<StyledProps>`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  transition: all 0.5s ease;
  transform-origin: bottom center;
  transform: ${({ isExpanded }) => isExpanded ? 'scale(0.5) translateY(30%)' : 'scale(1)'};
  position: relative;
  z-index: 1001;
`;

const Holder = styled.div<StyledProps>`
  flex: 1;
  aspect-ratio: 1;
  background: ${({ darkMode, isActive }) => {
    if (isActive) {
      return darkMode 
        ? 'rgba(255, 45, 149, 0.2)' 
        : 'rgba(255, 45, 149, 0.3)';
    }
    return darkMode 
      ? 'rgba(26, 26, 46, 0.6)' 
      : 'rgba(43, 11, 63, 0.6)';
  }};
  border: 2px solid ${({ darkMode, isActive }) => {
    if (isActive) {
      return darkMode 
        ? SYNTHWAVE_RETROVERSE_THEMES.DARK.accent 
        : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.accent;
    }
    return darkMode 
      ? SYNTHWAVE_RETROVERSE_THEMES.DARK.secondary 
      : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.secondary;
  }};
  border-radius: 8px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: ${({ darkMode, isActive }) => {
    if (isActive) {
      return darkMode 
        ? '0 0 20px rgba(0, 243, 255, 0.4)' 
        : '0 0 20px rgba(0, 243, 255, 0.5)';
    }
    return 'none';
  }};

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent,
      ${({ darkMode, isActive }) => {
        if (isActive) {
          return darkMode 
            ? 'rgba(0, 243, 255, 0.15)' 
            : 'rgba(0, 243, 255, 0.2)';
        }
        return darkMode 
          ? 'rgba(255, 45, 149, 0.1)' 
          : 'rgba(255, 45, 149, 0.15)';
      }}
    );
    z-index: 1;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ darkMode, isActive }) => {
      if (isActive) {
        return darkMode 
          ? '0 0 30px rgba(0, 243, 255, 0.5)' 
          : '0 0 30px rgba(0, 243, 255, 0.6)';
      }
      return darkMode 
        ? '0 0 20px rgba(255, 45, 149, 0.3)' 
        : '0 0 20px rgba(255, 45, 149, 0.4)';
    }};

    &:before {
      background: linear-gradient(
        45deg,
        transparent,
        ${({ darkMode, isActive }) => {
          if (isActive) {
            return darkMode 
              ? 'rgba(0, 243, 255, 0.25)' 
              : 'rgba(0, 243, 255, 0.3)';
          }
          return darkMode 
            ? 'rgba(255, 45, 149, 0.2)' 
            : 'rgba(255, 45, 149, 0.25)';
        }}
      );
    }
  }
`;

const HolderContent = styled.div<StyledProps>`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Title = styled.h3<StyledProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.header.family};
  font-size: ${({ isExpanded }) => isExpanded 
    ? SYNTHWAVE_RETROVERSE_FONTS.size.normal 
    : SYNTHWAVE_RETROVERSE_FONTS.size.large};
  color: ${({ darkMode, isActive }) => {
    if (isActive) {
      return darkMode 
        ? SYNTHWAVE_RETROVERSE_THEMES.DARK.accent 
        : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.accent;
    }
    return darkMode 
      ? SYNTHWAVE_RETROVERSE_THEMES.DARK.text 
      : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.text;
  }};
  margin: 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: ${({ darkMode, isActive }) => {
    if (isActive) {
      return darkMode 
        ? '0 0 10px rgba(0, 243, 255, 0.5)' 
        : '0 0 10px rgba(0, 243, 255, 0.7)';
    }
    return darkMode 
      ? '0 0 10px rgba(255, 45, 149, 0.5)' 
      : '0 0 10px rgba(255, 45, 149, 0.7)';
  }};
  transition: all 0.3s ease;
`;

const ContentHolders: React.FC<ContentHoldersProps> = ({ darkMode }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    { key: 'working-skills', title: 'Working Skills', component: WorkingSkills },
    { key: 'language-proficiency', title: 'Language Proficiency', component: LanguageProficiency },
    { key: 'redirections', title: 'Redirections', component: Redirections },
    { key: 'contacts', title: 'Contacts', component: Contacts }
  ];

  const handleClick = (sectionKey: string) => {
    setActiveSection(activeSection === sectionKey ? null : sectionKey);
  };

  const ActiveComponent = activeSection 
    ? sections.find(section => section.key === activeSection)?.component 
    : null;

  return (
    <Container isExpanded={!!activeSection} darkMode={darkMode}>
      {activeSection && ActiveComponent && (
        <HologramDialog darkMode={darkMode}>
          <ActiveComponent darkMode={darkMode} />
        </HologramDialog>
      )}
      <HoldersRow isExpanded={!!activeSection} darkMode={darkMode}>
        {sections.map((section) => (
          <Holder 
            key={section.key} 
            darkMode={darkMode}
            isActive={activeSection === section.key}
            isExpanded={!!activeSection}
            onClick={() => handleClick(section.key)}
          >
            <HolderContent 
              darkMode={darkMode} 
              isActive={activeSection === section.key}
              isExpanded={!!activeSection}
            >
              <Title 
                darkMode={darkMode} 
                isActive={activeSection === section.key}
                isExpanded={!!activeSection}
              >
                {section.title}
              </Title>
            </HolderContent>
          </Holder>
        ))}
      </HoldersRow>
    </Container>
  );
};

export default ContentHolders; 