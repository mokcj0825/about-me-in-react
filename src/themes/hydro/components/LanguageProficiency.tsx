import React from 'react';
import Book from "./language-proficiency/book";


interface LanguageProficiencyProps {
  darkMode: boolean;
}

const containerStyles = {
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '40px'
} as const;

const bookContainerStyles = {
  width: '100%',
  height: '700px',
  position: 'relative',
  margin: '0 auto',
  zIndex: '1000'
} as const;

const LanguageProficiency: React.FC<LanguageProficiencyProps> = ({ darkMode }) => {

  return (
    <div style={containerStyles}>
      
      <div style={bookContainerStyles}>
        <div style={containerStyles}>
          <Book darkMode={darkMode} />
          {/*}
          <div style={{
            width: '800px',
            height: '600px',
            display: 'flex',
            flexDirection: 'row'
          }} >
            <EmptyPage darkMode={darkMode} />
          <PageCover darkMode={darkMode} />
          </div>
          {*/}
        </div>
      </div>
    </div>
  );
};

export default LanguageProficiency;
