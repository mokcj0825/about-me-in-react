import React, { memo } from 'react';
import styled from 'styled-components';

// Constants for configuration
const BACKGROUND_CONFIG = {
  PATH: '/background/',
};

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: #000;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 1;
  transition: opacity 0.3s ease;
`;

interface BackgroundLayerProps {
  backgroundImage: string | null;
}

/**
 * BackgroundLayer component
 * 
 * Responsible only for displaying the background image
 * Receives background image from parent component
 * Completely isolated from other components
 */
const BackgroundLayer: React.FC<BackgroundLayerProps> = ({ backgroundImage }) => {
  console.log('BackgroundLayer rendered with:', backgroundImage);
  
  return (
    <BackgroundContainer>
      {backgroundImage && (
        <BackgroundImage
          id="dialog-background"
          style={{ 
            backgroundImage: `url(${BACKGROUND_CONFIG.PATH}${backgroundImage})`,
          }}
        />
      )}
    </BackgroundContainer>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(BackgroundLayer); 