import React, { ReactNode } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import '../styles/transitions.css';

interface ThemeTransitionProps {
  theme: string;
  children: ReactNode;
}

const ThemeTransition: React.FC<ThemeTransitionProps> = ({ theme, children }) => {
  const nodeRef = React.useRef(null);

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={theme}
        nodeRef={nodeRef}
        timeout={500}
        classNames="theme-fade"
        unmountOnExit
      >
        <div ref={nodeRef} className="theme-transition">
          {children}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default ThemeTransition; 