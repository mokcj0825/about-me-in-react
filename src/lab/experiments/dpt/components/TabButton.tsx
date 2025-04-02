import React from 'react';

interface TabButtonProps {
  id: string;
  title: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ id, title, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "4px",
      background: isActive ? "#007bff" : "#e9ecef",
      color: isActive ? "#fff" : "#333",
      cursor: "pointer",
      whiteSpace: "nowrap"
    }}
  >
    {title}
  </button>
);

export default TabButton; 