import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section style={{
    marginBottom: '2rem',
    maxHeight: '600px', // Maximum height before scrolling
    display: 'flex',
    flexDirection: 'column'
  }}>
    <h2 style={{ 
      margin: '0 0 1rem 0',
      fontSize: '1.25rem',
      position: 'sticky',
      top: 0,
      backgroundColor: '#fff',
      padding: '0.5rem 0',
      zIndex: 1
    }}>
      {title}
    </h2>
    <div 
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        flex: 1,
        padding: '0.5rem',
        borderRadius: '4px',
        backgroundColor: '#fafafa',
        overscrollBehavior: 'contain',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}
      className="section-content"
    >
      <style>
        {`
          .section-content::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {children}
    </div>
  </section>
);

export default Section; 