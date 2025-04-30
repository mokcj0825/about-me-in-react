import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import { CharacterPosition } from '../EventCommand';
import { characterService } from '../services/CharacterService';

// Constants for configuration
const SPRITE_CONFIG = {
  PATH: '/character-sprite/',
};

const CharacterContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none; /* Allow clicks to pass through to layers below */
`;

const CharacterSprite = styled.div<{ position: CharacterPosition }>`
  position: absolute;
  bottom: 0;
  left: ${props => {
    switch (props.position) {
      case CharacterPosition.LEFT:
        return '10%';
      case CharacterPosition.MIDDLE:
        return '50%';
      case CharacterPosition.RIGHT:
        return '90%';
      default:
        return '50%';
    }
  }};
  transform: ${props => {
    switch (props.position) {
      case CharacterPosition.LEFT:
        return 'translateX(-20%)';
      case CharacterPosition.MIDDLE:
        return 'translateX(-50%)';
      case CharacterPosition.RIGHT:
        return 'translateX(-80%)';
      default:
        return 'translateX(-50%)';
    }
  }};
  height: 80%;
  transition: opacity 0.3s ease;
`;

const CharacterImage = styled.img`
  height: 100%;
  max-height: 500px;
  max-width: 300px;
  object-fit: contain;
`;

interface CharacterLayerProps {
  // Component receives no props - it uses the characterService
}

/**
 * CharacterLayer component
 * 
 * Responsible only for displaying character sprites
 * Listens to the characterService for changes
 * Completely isolated from other components
 */
const CharacterLayer: React.FC<CharacterLayerProps> = () => {
  const [characters, setCharacters] = useState<Record<CharacterPosition, string | null>>(
    characterService.getCharacters()
  );
  
  // Listen for character changes from the service
  useEffect(() => {
    const handleCharacterChange = (newCharacters: Record<CharacterPosition, string | null>) => {
      console.log('Characters changed:', newCharacters);
      setCharacters(newCharacters);
    };
    
    // Subscribe to character changes
    characterService.addChangeListener(handleCharacterChange);
    
    // Clean up subscription
    return () => {
      characterService.removeChangeListener(handleCharacterChange);
    };
  }, []);
  
  console.log('CharacterLayer rendered with:', characters);
  
  return (
    <CharacterContainer>
      {Object.entries(characters).map(([position, spriteUrl]) => 
        spriteUrl && (
          <CharacterSprite 
            key={`${position}-${spriteUrl}`}
            position={position as CharacterPosition}
          >
            <CharacterImage 
              src={`${SPRITE_CONFIG.PATH}${spriteUrl}.png`} 
              alt={`Character at ${position}`}
            />
          </CharacterSprite>
        )
      )}
    </CharacterContainer>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(CharacterLayer); 