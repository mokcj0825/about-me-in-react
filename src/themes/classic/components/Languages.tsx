import React from 'react';
import { Language } from '../types';

interface LanguageBarProps {
  language: Language;
}

const LanguageBar: React.FC<LanguageBarProps> = ({ language }) => {
  return (
    <div className="skill-item">
      <div className="skill-info">
        <div className="language-name">
          <span>{language.name}</span>
          {language.nativeName && (
            <span className="native-name">({language.nativeName})</span>
          )}
        </div>
        <span className="skill-level">{language.level}</span>
      </div>
      <div className="skill-bar-bg">
        <div 
          className="skill-bar-fill language-bar"
          style={{
            '--fill-width': `${language.proficiency}%`
          } as React.CSSProperties}
        >
        </div>
      </div>
    </div>
  );
};

interface LanguagesProps {
  languages: Language[];
}

const Languages: React.FC<LanguagesProps> = ({ languages }) => {
  return (
    <section className="languages">
      <h2>Languages</h2>
      <div className="skills-grid">
        {languages.map((language, index) => (
          <LanguageBar key={index} language={language} />
        ))}
      </div>
    </section>
  );
};

export default Languages; 