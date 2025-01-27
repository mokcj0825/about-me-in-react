import React from 'react';
import workingSkills from '../../../data/working-skills.json';
import BottomCardList from './working-skills/BottomCardList';

interface WorkingSkillsProps {
  darkMode: boolean;
}

const WorkingSkills: React.FC<WorkingSkillsProps> = ({ darkMode }) => {
  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px'
    }}>
      {/* Upper Part - Description */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <h2 style={{
          fontSize: '2.5em',
          margin: 0
        }}>
          Working Skills
        </h2>
        <p style={{
          fontSize: '1.2em',
          maxWidth: '800px',
          textAlign: 'center',
          opacity: 0.8
        }}>
          A collection of technologies I've worked with and mastered over the years.
          Each represents a journey of learning and practical application.
        </p>
      </div>

      {/* Bottom Card List */}
      <BottomCardList 
        darkMode={darkMode}
        skills={workingSkills}
      />
    </div>
  );
};

export default WorkingSkills;
