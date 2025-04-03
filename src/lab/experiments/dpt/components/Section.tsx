import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section style={{ 
    background: "#f8f9fa", 
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0
  }}>
    <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem", flexShrink: 0 }}>{title}</h2>
    <div style={{ 
      overflow: "auto",
      flex: 1
    }}>
      {children}
    </div>
  </section>
);

export default Section; 