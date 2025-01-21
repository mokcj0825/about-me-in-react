import React from 'react';
import { Skill } from '../types';

interface SkillBarProps {
  name: string;
  level: number;
  color?: string;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, level, color }) => {
  return (
    <div className="skill-item">
      <div className="skill-info">
        <span className="skill-name">{name}</span>
        <span className="skill-percentage">{level}%</span>
      </div>
      <div className="skill-bar-bg">
        <div 
          className="skill-bar-fill"
          style={{
            '--fill-width': `${level}%`,
            backgroundColor: color
          } as React.CSSProperties}
        >
        </div>
      </div>
    </div>
  );
};

interface SkillsProps {
  skills: Skill[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <section className="skills">
      <h2>Skills</h2>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <SkillBar
            key={index}
            name={skill.name}
            level={skill.level}
            color={skill.color}
          />
        ))}
      </div>
    </section>
  );
};

export default Skills; 