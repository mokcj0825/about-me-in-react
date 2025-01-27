import React, { useState } from 'react';
import TypeScriptIcon from '../../../../assets/typescript.svg';
import JavaScriptIcon from '../../../../assets/javascript.svg';
import ReactIcon from '../../../../assets/react.svg';
import AngularIcon from '../../../../assets/angular.svg';
import CSSIcon from '../../../../assets/css.svg';
import SASSIcon from '../../../../assets/sass.svg';
import AWSIcon from '../../../../assets/AWS.svg';
import FirebaseIcon from '../../../../assets/firebase.svg';
import GitHubIcon from '../../../../assets/githubaction.svg';
import CSharpIcon from '../../../../assets/csharp.svg';
import KotlinIcon from '../../../../assets/kotlin.svg';
import PythonIcon from '../../../../assets/python.svg';
import ExpressIcon from '../../../../assets/expressjs.svg';
import GPTIcon from '../../../../assets/gpt.svg';

interface BottomCardProps {
  darkMode: boolean;
  skill: {
    skills: string;
    description: string;
    icon: string;
  };
}

const iconMap: { [key: string]: string } = {
  'typescript.svg': TypeScriptIcon,
  'javascript.svg': JavaScriptIcon,
  'react.svg': ReactIcon,
  'angular.svg': AngularIcon,
  'css.svg': CSSIcon,
  'sass.svg': SASSIcon,
  'AWS.svg': AWSIcon,
  'Firebase.svg': FirebaseIcon,
  'githubaction.svg': GitHubIcon,
  'csharp.svg': CSharpIcon,
  'kotlin.svg': KotlinIcon,
  'python.svg': PythonIcon,
  'expressjs.svg': ExpressIcon,
  'gpt.svg': GPTIcon
};

const BottomCard: React.FC<BottomCardProps> = ({ darkMode, skill }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '110px',
        height: '150px',
        background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        borderRadius: '10px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        opacity: isHovered ? 1 : 0.7,
        border: isHovered ? '2px solid #00c3ff' : '2px solid transparent',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
      }}
    >
      {/* Skill Icon */}
      <div style={{
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src={iconMap[skill.icon]}
          alt={skill.skills}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

    </div>
  );
};

export default BottomCard;
