import React from 'react';
import styled from 'styled-components';
import { SYNTHWAVE_RETROVERSE_THEMES } from '../colors';

interface HologramDialogProps {
  darkMode: boolean;
  children: React.ReactNode;
}

interface StyledProps {
  darkMode: boolean;
}

const Dialog = styled.div<StyledProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 15vh;
  z-index: 1000;
  background: ${({ darkMode }) => darkMode 
    ? 'rgba(26, 26, 46, 0.98)' 
    : 'rgba(43, 11, 63, 0.98)'};
  border: 2px solid ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.accent 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.accent};
  border-radius: 12px;
  backdrop-filter: blur(15px);
  transform-origin: center center;
  animation: hologramAppear 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  box-shadow: ${({ darkMode }) => darkMode 
    ? '0 0 50px rgba(0, 243, 255, 0.4) inset' 
    : '0 0 50px rgba(0, 243, 255, 0.5) inset'};
  opacity: 0;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  margin: 1rem;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.05) 3px,
      transparent 3px
    );
    pointer-events: none;
    animation: scanline 10s linear infinite;
    opacity: 0.5;
  }
  
  @keyframes hologramAppear {
    0% {
      opacity: 0;
      transform: scale(1.1);
      clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
    }
    30% {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    }
    100% {
      opacity: 1;
      transform: scale(1);
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    }
  }
  
  @keyframes scanline {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 100%;
    }
  }
`;

const HologramDialog: React.FC<HologramDialogProps> = ({ darkMode, children }) => {
  return (
    <Dialog darkMode={darkMode}>
      {children}
    </Dialog>
  );
};

export default HologramDialog; 