import React from 'react';
import styled from 'styled-components';
import { SYNTHWAVE_RETROVERSE_THEMES } from '../colors';
import { SYNTHWAVE_RETROVERSE_FONTS } from '../fonts';

interface SynthwaveRetroverseDarkModeToggleProps {
  darkMode: boolean;
  onDarkModeToggle: (isDark: boolean) => void;
}

interface StyledProps {
  darkMode: boolean;
}

const ToggleContainer = styled.div<StyledProps>`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.header.family};
`;

const ToggleLabel = styled.div<StyledProps>`
  color: ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.text 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.text};
  font-size: ${SYNTHWAVE_RETROVERSE_FONTS.size.normal};
  user-select: none;
`;

const ToggleSwitch = styled.div<StyledProps>`
  width: 60px;
  height: 30px;
  background: ${({ darkMode }) => darkMode 
    ? 'rgba(43, 11, 63, 0.8)' 
    : 'rgba(255, 45, 149, 0.1)'};
  border: 2px solid ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.secondary 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.secondary};
  border-radius: 15px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.neon.primary 
    : 'none'};

  &:hover {
    box-shadow: ${({ darkMode }) => darkMode 
      ? SYNTHWAVE_RETROVERSE_THEMES.DARK.neon.primary 
      : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.neon.primary};
  }

  &:before {
    content: '';
    position: absolute;
    left: ${({ darkMode }) => darkMode ? 'calc(100% - 28px)' : '2px'};
    top: 2px;
    width: 24px;
    height: 24px;
    background: ${({ darkMode }) => darkMode 
      ? SYNTHWAVE_RETROVERSE_THEMES.DARK.secondary 
      : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.secondary};
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px ${({ darkMode }) => darkMode 
      ? 'rgba(255, 45, 149, 0.5)' 
      : 'rgba(255, 45, 149, 0.3)'};
  }

  &:after {
    content: '${({ darkMode }) => darkMode ? '🌙' : '☀️'}';
    position: absolute;
    top: 50%;
    ${({ darkMode }) => darkMode ? 'left: 8px' : 'right: 8px'};
    transform: translateY(-50%);
    font-size: 14px;
    transition: all 0.3s ease;
  }
`;

const SynthwaveRetroverseDarkModeToggle: React.FC<SynthwaveRetroverseDarkModeToggleProps> = ({
  darkMode,
  onDarkModeToggle
}) => {
  return (
    <ToggleContainer darkMode={darkMode}>
      <ToggleLabel darkMode={darkMode}>
        {darkMode ? 'Dark Mode' : 'Light Mode'}
      </ToggleLabel>
      <ToggleSwitch 
        darkMode={darkMode}
        onClick={() => onDarkModeToggle(!darkMode)}
        role="switch"
        aria-checked={darkMode}
      />
    </ToggleContainer>
  );
};

export default SynthwaveRetroverseDarkModeToggle; 