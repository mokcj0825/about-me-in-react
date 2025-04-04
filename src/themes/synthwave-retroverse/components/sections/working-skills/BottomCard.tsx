import React from 'react';
import styled from 'styled-components';
import { SYNTHWAVE_RETROVERSE_FONTS } from '../../../fonts';
import { StyledSectionProps, getSectionColors } from '../SectionProps';

// Import icons
import typescriptIcon from '../../../../../assets/typescript.svg';
import javascriptIcon from '../../../../../assets/javascript.svg';
import reactIcon from '../../../../../assets/react.svg';
import reactNightIcon from '../../../../../assets/react-night.svg';
import angularIcon from '../../../../../assets/angular.svg';
import cssIcon from '../../../../../assets/css.svg';
import sassIcon from '../../../../../assets/sass.svg';
import awsIcon from '../../../../../assets/AWS.svg';
import firebaseIcon from '../../../../../assets/Firebase.svg';
import githubActionIcon from '../../../../../assets/githubaction.svg';
import csharpIcon from '../../../../../assets/csharp.svg';
import kotlinIcon from '../../../../../assets/kotlin.svg';
import pythonIcon from '../../../../../assets/python.svg';
import expressjsIcon from '../../../../../assets/expressjs.svg';
import expressjsNightIcon from '../../../../../assets/expressjs-night.svg';
import gptIcon from '../../../../../assets/gpt.svg';

const iconMap: { [key: string]: string } = {
  'typescript.svg': typescriptIcon,
  'javascript.svg': javascriptIcon,
  'react.svg': reactIcon,
  'react-night.svg': reactNightIcon,
  'angular.svg': angularIcon,
  'css.svg': cssIcon,
  'sass.svg': sassIcon,
  'AWS.svg': awsIcon,
  'Firebase.svg': firebaseIcon,
  'githubaction.svg': githubActionIcon,
  'csharp.svg': csharpIcon,
  'kotlin.svg': kotlinIcon,
  'python.svg': pythonIcon,
  'expressjs.svg': expressjsIcon,
  'expressjs-night.svg': expressjsNightIcon,
  'gpt.svg': gptIcon,
};

interface Skill {
  skills: string;
  description: string;
  icon: string;
  'icon-night'?: string;
  jokes?: string;
}

interface BottomCardProps extends StyledSectionProps {
  skill: Skill;
  isSelected: boolean;
  onClick: () => void;
}

const Icon = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;

const Name = styled.div<StyledSectionProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.header.family};
  font-size: ${SYNTHWAVE_RETROVERSE_FONTS.size.small};
  color: ${({ darkMode }) => getSectionColors(darkMode).text};
  text-align: center;
`;

const Card = styled.div<StyledSectionProps & { isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1rem 1rem;
  background: ${({ darkMode, isSelected }) => 
    isSelected 
      ? darkMode ? 'rgba(26, 26, 46, 0.9)' : 'rgba(43, 11, 63, 0.9)'
      : darkMode ? 'rgba(26, 26, 46, 0.4)' : 'rgba(43, 11, 63, 0.4)'
  };
  border: 1px solid ${({ darkMode, isSelected }) => 
    isSelected ? getSectionColors(darkMode).accent : getSectionColors(darkMode).secondary
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

    ${Name} {
      color: #2979ff;
      text-shadow: 0 0 8px rgba(41, 121, 255, 0.6);
    }

    ${Icon} {
      filter: drop-shadow(0 0 8px rgba(41, 121, 255, 0.6));
    }
  }
`;

const BottomCard: React.FC<BottomCardProps> = ({ skill, isSelected, darkMode, onClick }) => {
  const iconKey = darkMode && skill['icon-night'] ? skill['icon-night'] : skill.icon;
  const iconSrc = iconMap[iconKey];

  return (
    <Card darkMode={darkMode} isSelected={isSelected} onClick={onClick}>
      <Icon 
        src={iconSrc}
        alt={skill.skills} 
      />
      <Name darkMode={darkMode}>{skill.skills}</Name>
    </Card>
  );
};

export default BottomCard; 