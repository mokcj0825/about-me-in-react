import React from 'react';
import styled from 'styled-components';
import { StyledSectionProps, getSectionColors } from '../SectionProps';
import BottomCard from './BottomCard';

interface Skill {
  skills: string;
  description: string;
  icon: string;
  'icon-night'?: string;
  jokes?: string;
}

interface BottomCardListProps extends StyledSectionProps {
  skills: Skill[];
  selectedSkill: Skill | null;
  onSkillSelect: (skill: Skill) => void;
}

const Grid = styled.div<StyledSectionProps>`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  padding: 1rem;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ darkMode }) => getSectionColors(darkMode).secondary};
    border-radius: 4px;
  }
`;

const BottomCardList: React.FC<BottomCardListProps> = ({ 
  skills, 
  selectedSkill, 
  darkMode, 
  onSkillSelect 
}) => {
  return (
    <Grid darkMode={darkMode}>
      {skills.map((skill) => (
        <BottomCard
          key={skill.skills}
          skill={skill}
          isSelected={selectedSkill?.skills === skill.skills}
          darkMode={darkMode}
          onClick={() => onSkillSelect(skill)}
        />
      ))}
    </Grid>
  );
};

export default BottomCardList; 