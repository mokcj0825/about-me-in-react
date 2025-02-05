import React, { useState, useEffect } from 'react';
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
  padding: '40px',
  position: 'relative',
  overflow: 'hidden'
} as const;

const backgroundContainerStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
} as const;

const backgroundImageStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '100%',
  maxHeight: '100%',
  opacity: 0.1,
  transition: 'opacity 1s ease-in-out',
  userSelect: 'none',
  pointerEvents: 'none'
} as const;

const headerStyles = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  marginBottom: '40px',
  position: 'relative',
  zIndex: 1
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
  gap: '15px',
  position: 'relative',
  zIndex: 1
} as const;

const BACKGROUNDS = {
  light: [
    'https://storage.googleapis.com/cj-mok-stash/fontaine10-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine11-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine12-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine13-bl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine14-bl.png'
  ],
  dark: [
    'https://storage.googleapis.com/cj-mok-stash/fontaine10-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine11-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine12-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine13-wl.png',
    'https://storage.googleapis.com/cj-mok-stash/fontaine14-wl.png'
  ]
};

const WorkingSkills: React.FC<WorkingSkillsProps> = ({ darkMode }) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill>(() => workingSkills[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Preload images
  useEffect(() => {
    const preloadImages = (urls: string[]) => {
      urls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };

    preloadImages([...BACKGROUNDS.light, ...BACKGROUNDS.dark]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % BACKGROUNDS.light.length);
        setIsTransitioning(false);
      }, 500);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  return (
    <div style={containerStyles}>
      <div style={backgroundContainerStyles}>
        <img 
          src={darkMode ? BACKGROUNDS.dark[currentImageIndex] : BACKGROUNDS.light[currentImageIndex]}
          alt=""
          aria-hidden="true"
          style={{
            ...backgroundImageStyles,
            opacity: isTransitioning ? 0 : 0.1
          }}
        />
      </div>
      
      <div style={headerStyles}>
        <h2 style={titleStyles}>
          Working Skills
        </h2>
        <p style={descriptionStyles}>
          I used them in work.
        </p>
      </div>

      <div style={skillDetailsStyles}>
        <h3 style={{ fontSize: '1.8em', margin: 0 }}>
          {selectedSkill.skills}
        </h3>
        <p style={{ fontSize: '1.1em', opacity: 0.8 }}>
          {selectedSkill.description}
        </p>
      </div>

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
