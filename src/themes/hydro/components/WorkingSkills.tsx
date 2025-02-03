import React, { useState } from 'react';
import workingSkills from '../../../data/working-skills.json';
import BottomCardList from './working-skills/BottomCardList';

interface Skill {
  skills: string;
  description: string;
  icon: string;
  'icon-night'?: string;
}

interface WorkingSkillsProps {
  darkMode: boolean;
}

const containerStyles = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '40px'
} as const;

const headerStyles = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  marginBottom: '40px'
} as const;

const titleStyles = {
  fontSize: '2.5em',
  margin: 0
} as const;

const descriptionStyles = {
  fontSize: '1.2em',
  maxWidth: '800px',
  textAlign: 'center',
  opacity: 0.8
} as const;

const skillDetailsStyles = {
  width: '100%',
  maxWidth: '800px',
  textAlign: 'center',
  marginBottom: '40px',
  minHeight: '100px', 
  height: '50vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '15px'
} as const;

const WorkingSkills: React.FC<WorkingSkillsProps> = ({ darkMode }) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill>(() => {
    // Initialize with the first skill from workingSkills
    return workingSkills[0];
  });

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  return (
    <div style={containerStyles}>
      {/* Upper Part - Title & Description */}
      <div style={headerStyles}>
        <h2 style={titleStyles}>
          Working Skills
        </h2>
        <p style={descriptionStyles}>
          I used them in work.
        </p>
      </div>

      {/* Skill Details Section */}
      <div style={skillDetailsStyles}>
        <h3 style={{ fontSize: '1.8em', margin: 0 }}>
          {selectedSkill.skills}
        </h3>
        <p style={{ fontSize: '1.1em', opacity: 0.8 }}>
          {selectedSkill.description}
        </p>
      </div>

      {/* Bottom Card List */}
      <BottomCardList 
        darkMode={darkMode}
        skills={workingSkills}
        selectedSkill={selectedSkill}
        onSkillSelect={handleSkillSelect}
      />
    </div>
  );
};

export default WorkingSkills;
