import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ThemeType } from '../../ThemeType';
import { SYNTHWAVE_RETROVERSE_THEMES } from '../colors';
import { SYNTHWAVE_RETROVERSE_FONTS } from '../fonts';

interface SynthwaveRetroverseSelectorProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  darkMode: boolean;
}

interface StyledProps {
  darkMode: boolean;
}

interface DropdownProps extends StyledProps {
  isOpen?: boolean;
}

const DropdownContainer = styled.div<StyledProps>`
  position: relative;
  width: 250px;
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.header.family};
  z-index: 100;
`;

const SelectedOption = styled.div<DropdownProps>`
  padding: 0.75rem 1rem;
  background: ${({ darkMode }) => darkMode 
    ? 'rgba(43, 11, 63, 0.8)' 
    : 'rgba(255, 45, 149, 0.1)'};
  color: ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.text 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.text};
  border: 2px solid ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.secondary 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.secondary};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: ${({ darkMode, isOpen }) => isOpen 
    ? (darkMode ? SYNTHWAVE_RETROVERSE_THEMES.DARK.neon.primary : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.neon.primary)
    : 'none'};

  &:hover {
    box-shadow: ${({ darkMode }) => darkMode 
      ? SYNTHWAVE_RETROVERSE_THEMES.DARK.neon.primary 
      : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.neon.primary};
  }

  &:after {
    content: '▼';
    font-size: 0.8em;
    transition: transform 0.3s ease;
    transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const DropdownList = styled.div<DropdownProps>`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: ${({ darkMode }) => darkMode 
    ? 'rgba(26, 26, 46, 0.95)' 
    : 'rgba(43, 11, 63, 0.95)'};
  border: 2px solid ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.secondary 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.secondary};
  border-radius: 8px;
  padding: 0.5rem;
  backdrop-filter: blur(10px);
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  box-shadow: ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.neon.primary 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.neon.primary};
`;

const Option = styled.div<StyledProps>`
  padding: 0.75rem 1rem;
  color: ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.text 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.text};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${({ darkMode }) => darkMode 
      ? 'rgba(255, 45, 149, 0.2)' 
      : 'rgba(255, 45, 149, 0.3)'};
    transform: translateX(5px);
    box-shadow: ${({ darkMode }) => darkMode 
      ? '0 0 10px rgba(255, 45, 149, 0.3)' 
      : '0 0 10px rgba(255, 45, 149, 0.4)'};
  }

  &:not(:last-child) {
    margin-bottom: 0.25rem;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ darkMode }) => darkMode 
        ? 'rgba(255, 45, 149, 0.1)' 
        : 'rgba(255, 45, 149, 0.2)'},
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover:before {
    left: 100%;
  }
`;

const SynthwaveRetroverseSelector: React.FC<SynthwaveRetroverseSelectorProps> = ({
  currentTheme,
  onThemeChange,
  darkMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatThemeName = (theme: string) => {
    return theme.charAt(0).toUpperCase() + theme.slice(1).replace('-', ' ');
  };

  return (
    <DropdownContainer ref={dropdownRef} darkMode={darkMode}>
      <SelectedOption 
        darkMode={darkMode} 
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        Other themes?
      </SelectedOption>
      <DropdownList darkMode={darkMode} isOpen={isOpen}>
        {['dull', 'hydro', 'synthwave-retroverse'].map((theme) => (
          <Option
            key={theme}
            darkMode={darkMode}
            onClick={() => {
              onThemeChange(theme as ThemeType);
              setIsOpen(false);
            }}
          >
            {formatThemeName(theme)}
          </Option>
        ))}
      </DropdownList>
    </DropdownContainer>
  );
};

export default SynthwaveRetroverseSelector; 