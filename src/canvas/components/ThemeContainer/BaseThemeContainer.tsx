import React, { ReactNode } from 'react';

export interface BaseThemeContainerProps {
  theme: string;
  darkMode: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

const BaseThemeContainer: React.FC<BaseThemeContainerProps> = ({
  theme,
  darkMode,
  className = '',
  style = {},
  children
}) => {
  return (
    <div 
      className={`base-theme-container ${theme}-theme ${darkMode ? 'dark' : 'light'} ${className}`}
      style={style}
      role="main"
      aria-label={`${theme} theme content`}
    >
      {children}
    </div>
  );
};

export default BaseThemeContainer;
