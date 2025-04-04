import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { SYNTHWAVE_RETROVERSE_FONTS } from '../../fonts';
import { SectionProps, StyledSectionProps, getSectionColors } from './SectionProps';
import workingSkillsData from '../../../../data/working-skills.json';
import BottomCardList from './working-skills/BottomCardList';

interface Skill {
  skills: string;
  description: string;
  icon: string;
  'icon-night'?: string;
  jokes?: string;
}

// Unique glitch effect for Working Skills - RGB split with wave distortion
const glitchWS = keyframes`
  0% {
    text-shadow: 2px 0 0 red, -2px 0 0 #0ff;
    transform: translate(0);
  }
  25% {
    text-shadow: -2px 0 0 red, 2px 0 0 #0ff;
    transform: translate(-2px) skew(10deg);
  }
  50% {
    text-shadow: 2px 0 0 red, -2px 0 0 #0ff;
    transform: translate(0) skew(-10deg);
  }
  75% {
    text-shadow: -2px 0 0 red, 2px 0 0 #0ff;
    transform: translate(2px) skew(5deg);
  }
  100% {
    text-shadow: 2px 0 0 red, -2px 0 0 #0ff;
    transform: translate(0);
  }
`;

const Container = styled.div<StyledSectionProps>`
  display: flex;
  flex-direction: column;
  height: 100%;
  color: ${({ darkMode }) => getSectionColors(darkMode).text};
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
    animation: ${glitchWS} 5s infinite;
    opacity: 0.8;
  }
`;

const DescriptionBar = styled.div<StyledSectionProps>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: ${({ darkMode }) => darkMode ? 'rgba(26, 26, 46, 0.8)' : 'rgba(43, 11, 63, 0.8)'};
  border-top: 1px solid ${({ darkMode }) => getSectionColors(darkMode).secondary};
  min-height: 80px;
  margin-top: auto;
`;

const Description = styled.p<StyledSectionProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.body.family};
  font-size: ${SYNTHWAVE_RETROVERSE_FONTS.size.normal};
  color: ${({ darkMode }) => getSectionColors(darkMode).text};
  margin: 0;
  flex: 1;
`;

const Joke = styled.p<StyledSectionProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.body.family};
  font-size: ${SYNTHWAVE_RETROVERSE_FONTS.size.small};
  color: ${({ darkMode }) => getSectionColors(darkMode).accent};
  margin: 0;
  opacity: 0.8;
  font-style: italic;
`;

const WorkingSkills: React.FC<SectionProps> = ({ darkMode }) => {
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  return (
    <Container darkMode={darkMode}>
      <Title darkMode={darkMode} data-text="Working Skills">Working Skills</Title>
      <BottomCardList 
        darkMode={darkMode}
        skills={workingSkillsData}
        selectedSkill={activeSkill}
        onSkillSelect={(skill) => setActiveSkill(activeSkill?.skills === skill.skills ? null : skill)}
      />
      <DescriptionBar darkMode={darkMode}>
        {activeSkill ? (
          <>
            <Description darkMode={darkMode}>{activeSkill.description}</Description>
            {activeSkill.jokes && (
              <Joke darkMode={darkMode}>{activeSkill.jokes}</Joke>
            )}
          </>
        ) : (
          <Description darkMode={darkMode}>Select a skill to see more details...</Description>
        )}
      </DescriptionBar>
    </Container>
  );
};

export default WorkingSkills;