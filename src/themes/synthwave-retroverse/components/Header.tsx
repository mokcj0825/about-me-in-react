import React from 'react';
import styled from 'styled-components';
import { SYNTHWAVE_RETROVERSE_THEMES } from '../colors';
import { SYNTHWAVE_RETROVERSE_FONTS } from '../fonts';
import { useProfile } from '../../../services/ProfileContext';

interface HeaderProps {
  darkMode: boolean;
}

interface StyledProps {
  darkMode: boolean;
}

const HeaderContainer = styled.header<StyledProps>`
  position: relative;
  padding: 6rem 0 3rem;
  text-align: center;
  overflow: hidden;
`;

const Grid = styled.div<StyledProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      ${({ darkMode }) => darkMode 
        ? 'rgba(255, 45, 149, 0.05)' 
        : 'rgba(255, 45, 149, 0.1)'} 25%,
      ${({ darkMode }) => darkMode 
        ? 'rgba(255, 45, 149, 0.05)' 
        : 'rgba(255, 45, 149, 0.1)'} 26%,
      transparent 27%,
      transparent 74%,
      ${({ darkMode }) => darkMode 
        ? 'rgba(255, 45, 149, 0.05)' 
        : 'rgba(255, 45, 149, 0.1)'} 75%,
      ${({ darkMode }) => darkMode 
        ? 'rgba(255, 45, 149, 0.05)' 
        : 'rgba(255, 45, 149, 0.1)'} 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      ${({ darkMode }) => darkMode 
        ? 'rgba(255, 45, 149, 0.05)' 
        : 'rgba(255, 45, 149, 0.1)'} 25%,
      ${({ darkMode }) => darkMode 
        ? 'rgba(255, 45, 149, 0.05)' 
        : 'rgba(255, 45, 149, 0.1)'} 26%,
      transparent 27%,
      transparent 74%,
      ${({ darkMode }) => darkMode 
        ? 'rgba(255, 45, 149, 0.05)' 
        : 'rgba(255, 45, 149, 0.1)'} 75%,
      ${({ darkMode }) => darkMode 
        ? 'rgba(255, 45, 149, 0.05)' 
        : 'rgba(255, 45, 149, 0.1)'} 76%,
      transparent 77%,
      transparent
    );
  background-size: 50px 50px;
  z-index: 1;
`;

const Name = styled.h1<StyledProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.header.family};
  font-size: 4rem;
  font-weight: ${SYNTHWAVE_RETROVERSE_FONTS.weight.bold};
  color: ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.secondary 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.secondary};
  margin: 0 0 1rem;
  position: relative;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.neon.primary
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.neon.primary};

  @keyframes glow {
    0% {
      text-shadow: ${({ darkMode }) => darkMode 
        ? SYNTHWAVE_RETROVERSE_THEMES.DARK.neon.primary
        : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.neon.primary};
    }
    50% {
      text-shadow: ${({ darkMode }) => darkMode 
        ? '0 0 20px #FF2D95, 0 0 30px #FF2D95, 0 0 40px #FF2D95'
        : '0 0 20px #FF2D95, 0 0 30px #FF2D95'};
    }
    100% {
      text-shadow: ${({ darkMode }) => darkMode 
        ? SYNTHWAVE_RETROVERSE_THEMES.DARK.neon.primary
        : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.neon.primary};
    }
  }

  animation: glow 3s ease-in-out infinite;
`;

const Title = styled.h2<StyledProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.header.family};
  font-size: 2rem;
  font-weight: ${SYNTHWAVE_RETROVERSE_FONTS.weight.medium};
  color: ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.accent 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.accent};
  margin: 0 0 1.5rem;
  position: relative;
  z-index: 2;
  text-shadow: ${({ darkMode }) => darkMode 
    ? '0 0 10px #00F3FF, 0 0 20px #00F3FF'
    : '0 0 10px #00F3FF'};
`;

const About = styled.p<StyledProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.body.family};
  font-size: 1.25rem;
  font-weight: ${SYNTHWAVE_RETROVERSE_FONTS.weight.normal};
  color: ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.text 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.text};
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  line-height: ${SYNTHWAVE_RETROVERSE_FONTS.lineHeight.loose};
  opacity: 0.9;
`;

const Header: React.FC<HeaderProps> = ({ darkMode }) => {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <HeaderContainer darkMode={darkMode}>
        <Grid darkMode={darkMode} />
        <About darkMode={darkMode}>Loading...</About>
      </HeaderContainer>
    );
  }

  if (error || !profile) {
    return (
      <HeaderContainer darkMode={darkMode}>
        <Grid darkMode={darkMode} />
        <About darkMode={darkMode}>Failed to load profile</About>
      </HeaderContainer>
    );
  }

  return (
    <HeaderContainer darkMode={darkMode}>
      <Grid darkMode={darkMode} />
      <Name darkMode={darkMode}>{profile.name}</Name>
      <Title darkMode={darkMode}>{profile.title}</Title>
      <About darkMode={darkMode}>{profile.bio}</About>
    </HeaderContainer>
  );
};

export default Header; 