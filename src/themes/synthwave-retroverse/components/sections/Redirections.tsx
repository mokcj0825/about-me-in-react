import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { SYNTHWAVE_RETROVERSE_FONTS } from '../../fonts';
import { SectionProps, StyledSectionProps, getSectionColors } from './SectionProps';

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
`;

// Unique glitch effect for Redirections - digital noise with random character replacement
const glitchRD = keyframes`
  0% {
    transform: translate(0);
    opacity: 1;
    filter: blur(0);
  }
  15% {
    transform: translate(-2px) scale(1.1);
    opacity: 0.8;
    filter: blur(1px);
  }
  30% {
    transform: translate(2px) scale(0.9);
    opacity: 0.9;
    filter: blur(0);
  }
  45% {
    transform: translate(-1px) scale(1.05);
    opacity: 0.8;
    filter: blur(2px);
  }
  60% {
    transform: translate(1px) scale(0.95);
    opacity: 1;
    filter: blur(0);
  }
  75% {
    transform: translate(2px) scale(1.1);
    opacity: 0.9;
    filter: blur(1px);
  }
  100% {
    transform: translate(0) scale(1);
    opacity: 1;
    filter: blur(0);
  }
`;

const BackgroundDecorations = styled.div<StyledSectionProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`;

interface ShapeProps extends StyledSectionProps {
  size: number;
  top: number;
  left: number;
  delay: number;
  duration: number;
}

const Shape = styled.div<ShapeProps>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  border: 2px solid ${({ darkMode }) => getSectionColors(darkMode).accent};
  opacity: 0.3;
  animation: ${float} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid ${({ darkMode }) => getSectionColors(darkMode).secondary};
    animation: ${pulse} 3s ease-in-out infinite;
    animation-delay: ${props => props.delay + 1}s;
  }
`;

const Triangle = styled(Shape)`
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
`;

const Diamond = styled(Shape)`
  transform: rotate(45deg);
`;

const Hexagon = styled(Shape)`
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
`;

const Container = styled.div<StyledSectionProps>`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
  color: ${({ darkMode }) => getSectionColors(darkMode).text};
  position: relative;
  overflow: hidden;
`;

const Title = styled.h2<StyledSectionProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.header.family};
  font-size: ${SYNTHWAVE_RETROVERSE_FONTS.size.xlarge};
  color: ${({ darkMode }) => getSectionColors(darkMode).accent};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: ${({ darkMode }) => `0 0 10px ${getSectionColors(darkMode).accent}`};
  position: relative;

  &::before {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    animation: ${glitchRD} 3.5s infinite;
    opacity: 0.8;
    color: #ff00ff;
    mix-blend-mode: screen;
  }
`;

const Description = styled.div<StyledSectionProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.body.family};
  font-size: ${SYNTHWAVE_RETROVERSE_FONTS.size.large};
  color: ${({ darkMode }) => getSectionColors(darkMode).text};
  text-align: center;
  margin-bottom: auto;
  transition: all 0.3s ease;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 60px;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding: 40px;
`;

const RedirectButton = styled.div<StyledSectionProps & { isHovered?: boolean }>`
  cursor: pointer;
  width: 25vw;
  height: 25vh;
  min-width: 250px;
  min-height: 200px;
  background: ${({ darkMode, isHovered }) => 
    isHovered
      ? darkMode ? 'rgba(41, 121, 255, 0.2)' : 'rgba(41, 121, 255, 0.15)'
      : darkMode ? 'rgba(26, 26, 46, 0.4)' : 'rgba(43, 11, 63, 0.4)'
  };
  border: 1px solid ${({ darkMode, isHovered }) => 
    isHovered ? '#2979ff' : getSectionColors(darkMode).secondary
  };
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.header.family};
  font-size: ${SYNTHWAVE_RETROVERSE_FONTS.size.xlarge};
  color: ${({ darkMode }) => getSectionColors(darkMode).text};
  text-shadow: ${({ darkMode, isHovered }) => 
    isHovered 
      ? '0 0 10px #2979ff'
      : `0 0 10px ${getSectionColors(darkMode).accent}`
  };
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

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
      rgba(41, 121, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 30px rgba(41, 121, 255, 0.4);

    &:before {
      left: 100%;
    }
  }
`;

const Redirections: React.FC<SectionProps> = ({ darkMode }) => {
  const [displayText, setDisplayText] = useState('Other places');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <Container darkMode={darkMode}>
      <BackgroundDecorations darkMode={darkMode}>
        <Triangle darkMode={darkMode} size={80} top={15} left={10} delay={0} duration={6} />
        <Diamond darkMode={darkMode} size={60} top={70} left={15} delay={1} duration={8} />
        <Hexagon darkMode={darkMode} size={100} top={20} left={85} delay={2} duration={7} />
        <Triangle darkMode={darkMode} size={70} top={75} left={80} delay={3} duration={9} />
        <Diamond darkMode={darkMode} size={50} top={40} left={90} delay={4} duration={6} />
        <Hexagon darkMode={darkMode} size={90} top={60} left={5} delay={2} duration={8} />
      </BackgroundDecorations>
      <Title darkMode={darkMode} data-text="Redirections">Redirections</Title>
      <Description darkMode={darkMode}>{displayText}</Description>
      <ButtonsContainer>
        <RedirectButton 
          darkMode={darkMode}
          isHovered={hoveredButton === 'stash'}
          onClick={() => window.location.href = '/stash'}
          onMouseEnter={() => {
            setHoveredButton('stash');
            setDisplayText('You can take a look on what I did. (Under construction)');
          }}
          onMouseLeave={() => {
            setHoveredButton(null);
            setDisplayText('Other places');
          }}
        >
          Stash
        </RedirectButton>
        <RedirectButton 
          darkMode={darkMode}
          isHovered={hoveredButton === 'labs'}
          onClick={() => window.location.href = '/labs'}
          onMouseEnter={() => {
            setHoveredButton('labs');
            setDisplayText('You can take a look on what I test.');
          }}
          onMouseLeave={() => {
            setHoveredButton(null);
            setDisplayText('Other places');
          }}
        >
          Labs
        </RedirectButton>
        <RedirectButton 
          darkMode={darkMode}
          isHovered={hoveredButton === 'core'}
          onClick={() => window.location.href = 'https://cj-react-core.web.app/'}
          onMouseEnter={() => {
            setHoveredButton('core');
            setDisplayText('Here is my core');
          }}
          onMouseLeave={() => {
            setHoveredButton(null);
            setDisplayText('Other places');
          }}
        >
          Core
        </RedirectButton>
      </ButtonsContainer>
    </Container>
  );
};

export default Redirections; 