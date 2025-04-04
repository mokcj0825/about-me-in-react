import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { SYNTHWAVE_RETROVERSE_FONTS } from '../../fonts';
import { SectionProps, StyledSectionProps, getSectionColors } from './SectionProps';
import languageData from '../../../../data/language-proficiency.json';

// Unique glitch effect for Language Proficiency - vertical split with color shift
const glitchLP = keyframes`
  0% {
    clip-path: inset(0 0 0 0);
    transform: translate(0);
    text-shadow: -2px 0 #2979ff;
  }
  10% {
    clip-path: inset(0 0 50% 0);
    transform: translate(-2px);
    text-shadow: 2px 0 #ff2970;
  }
  20% {
    clip-path: inset(50% 0 0 0);
    transform: translate(2px);
    text-shadow: -2px 0 #2979ff;
  }
  30% {
    clip-path: inset(25% 0 75% 0);
    transform: translate(0);
    text-shadow: 2px 0 #ff2970;
  }
  40% {
    clip-path: inset(75% 0 25% 0);
    transform: translate(-2px);
    text-shadow: -2px 0 #2979ff;
  }
  50% {
    clip-path: inset(0 0 0 0);
    transform: translate(0);
    text-shadow: 2px 0 #ff2970;
  }
  100% {
    clip-path: inset(0 0 0 0);
    transform: translate(0);
    text-shadow: -2px 0 #2979ff;
  }
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

const BackgroundDecorations = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`;

const CircularProgress = styled.div<StyledSectionProps & { progress: number; top: number; left: number; size: number; delay: number }>`
  position: absolute;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;
  opacity: 0.15;
  transform: translate(-50%, -50%);

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(
      #2979ff ${({ progress }) => progress}%,
      transparent ${({ progress }) => progress}%
    );
    mask: radial-gradient(farthest-side, transparent 70%, black 71%);
    transition: background 2s ease-in-out;
    animation: rotate 8s linear infinite;
    animation-delay: ${({ delay }) => delay}s;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
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
    animation: ${glitchLP} 4s infinite;
    opacity: 0.8;
  }
`;

const LanguagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
`;

const LanguageCard = styled.div<StyledSectionProps & { isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: ${({ darkMode, isSelected }) => 
    isSelected 
      ? darkMode ? 'rgba(26, 26, 46, 0.9)' : 'rgba(43, 11, 63, 0.9)'
      : darkMode ? 'rgba(26, 26, 46, 0.4)' : 'rgba(43, 11, 63, 0.4)'
  };
  border: 1px solid ${({ darkMode, isSelected }) => 
    isSelected ? '#2979ff' : getSectionColors(darkMode).secondary
  };
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ darkMode }) => 
      darkMode ? 'rgba(41, 121, 255, 0.2)' : 'rgba(41, 121, 255, 0.15)'
    };
    border-color: #2979ff;
    box-shadow: 0 0 20px rgba(41, 121, 255, 0.6);
    transform: translateY(-2px);
  }
`;

const LanguageName = styled.h3<StyledSectionProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.header.family};
  font-size: ${SYNTHWAVE_RETROVERSE_FONTS.size.normal};
  color: ${({ darkMode }) => getSectionColors(darkMode).accent};
  margin: 0;
  letter-spacing: 2px;
  text-align: center;
  text-shadow: ${({ darkMode }) => `0 0 8px ${getSectionColors(darkMode).accent}`};
`;

const DescriptionBar = styled.div<StyledSectionProps>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: ${({ darkMode }) => darkMode ? 'rgba(26, 26, 46, 0.8)' : 'rgba(43, 11, 63, 0.8)'};
  border-top: 1px solid ${({ darkMode }) => getSectionColors(darkMode).secondary};
  min-height: 80px;
  margin: 1rem 0;
`;

const Description = styled.p<StyledSectionProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.body.family};
  font-size: ${SYNTHWAVE_RETROVERSE_FONTS.size.normal};
  color: ${({ darkMode }) => getSectionColors(darkMode).text};
  margin: 0;
  flex: 1;
`;

interface Language {
  language: string;
  description: string;
}

const LanguageProficiency: React.FC<SectionProps> = ({ darkMode }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [progressValues, setProgressValues] = useState<number[]>([]);

  useEffect(() => {
    // Initialize random progress values for decorative circles
    const initialValues = Array(7).fill(0).map(() => 
      Math.floor(Math.random() * 41) + 40 // Random values between 40 and 80
    );
    setProgressValues(initialValues);

    // Update progress values periodically
    const interval = setInterval(() => {
      setProgressValues(prev => 
        prev.map(value => {
          const change = (Math.random() * 10) - 5; // Random change between -5 and +5
          return Math.min(Math.max(value + change, 40), 80);
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Fixed positions for decorative circles
  const circlePositions = [
    { top: 20, left: 15, size: 150, delay: 0 },
    { top: 70, left: 85, size: 180, delay: 2 },
    { top: 40, left: 90, size: 120, delay: 4 },
    { top: 80, left: 25, size: 160, delay: 6 },
    // New positions
    { top: 30, left: 50, size: 140, delay: 1 },
    { top: 65, left: 55, size: 130, delay: 3 },
    { top: 15, left: 75, size: 170, delay: 5 }
  ];

  return (
    <Container darkMode={darkMode}>
      <BackgroundDecorations>
        {progressValues.map((progress, index) => (
          <CircularProgress
            key={index}
            darkMode={darkMode}
            progress={progress}
            {...circlePositions[index]}
          />
        ))}
      </BackgroundDecorations>
      
      <Content>
        <Title darkMode={darkMode} data-text="Language Proficiency">Language Proficiency</Title>
        <LanguagesGrid>
          {(languageData as Language[]).map((lang) => (
            <LanguageCard 
              key={lang.language} 
              darkMode={darkMode}
              isSelected={selectedLanguage?.language === lang.language}
              onClick={() => setSelectedLanguage(selectedLanguage?.language === lang.language ? null : lang)}
            >
              <LanguageName darkMode={darkMode}>{lang.language}</LanguageName>
            </LanguageCard>
          ))}
        </LanguagesGrid>
        <DescriptionBar darkMode={darkMode}>
          {selectedLanguage ? (
            <Description darkMode={darkMode}>{selectedLanguage.description}</Description>
          ) : (
            <Description darkMode={darkMode}>Select a language to see more details...</Description>
          )}
        </DescriptionBar>
      </Content>
    </Container>
  );
};

export default LanguageProficiency; 