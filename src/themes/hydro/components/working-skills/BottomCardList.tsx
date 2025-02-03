import React, { useRef, useCallback, useMemo } from 'react';
import BottomCard from './BottomCard';

interface Skill {
  skills: string;
  description: string;
  icon: string;
  'icon-night'?: string;
}

interface BottomCardListProps {
  darkMode: boolean;
  skills: Skill[];
  selectedSkill?: Skill | null;
  onSkillSelect: (skill: Skill) => void;
}

const BottomCardList: React.FC<BottomCardListProps> = ({ 
  darkMode, 
  skills, 
  selectedSkill,
  onSkillSelect 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const buttonStyle = useMemo(() => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const), [darkMode]);

  const containerStyle = useMemo(() => ({
    width: '900px',
    position: 'relative' as const,
    padding: '20px 0',
    margin: '0 auto',
  }), []);

  const scrollableStyle = useMemo(() => ({
    width: '800px',
    margin: '0 50px',
    overflowX: 'auto' as const,
    overflowY: 'hidden' as const,
    scrollBehavior: 'smooth' as const,
    WebkitOverflowScrolling: 'touch' as const,
    msOverflowStyle: 'none' as const,
    scrollbarWidth: 'none' as const,
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  }), []);

  const cardsContainerStyle = useMemo(() => ({
    display: 'flex',
    gap: '34px',
    minWidth: 'min-content',
  }), []);

  const cardWrapperStyle = useMemo(() => ({
    flex: '0 0 110px',
    width: '110px',
  }), []);

  return (
    <div style={containerStyle}>
      <button
        onClick={() => handleScroll('left')}
        style={{ ...buttonStyle, left: '0' }}
      >
        ←
      </button>

      <div ref={scrollContainerRef} style={scrollableStyle}>
        <div style={cardsContainerStyle}>
          {skills.map((skill, index) => (
            <div key={`${skill.skills}-${index}`} style={cardWrapperStyle}>
              <BottomCard 
                darkMode={darkMode}
                skill={skill}
                isSelected={selectedSkill?.skills === skill.skills}
                onSelect={onSkillSelect}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => handleScroll('right')}
        style={{ ...buttonStyle, right: '0' }}
      >
        →
      </button>
    </div>
  );
};

export default React.memo(BottomCardList);
