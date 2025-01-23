import React, { ReactNode } from 'react';

export interface DarkModeToggleProps {
  darkMode: boolean;
  onToggle: (isDark: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

const BaseDarkModeToggle: React.FC<DarkModeToggleProps> = ({
  darkMode,
  onToggle,
  className = '',
  style = {},
  children
}) => {
  const handleToggle = () => {
    onToggle(!darkMode);
  };

  return (
    <div 
      className={`base-dark-mode-toggle ${className}`}
      style={style}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      aria-pressed={darkMode}
      aria-label="Toggle dark mode"
    >
      {children}
    </div>
  );
};

export default BaseDarkModeToggle;
