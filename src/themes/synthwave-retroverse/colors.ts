export const SYNTHWAVE_RETROVERSE_THEMES = {
  LIGHT: {
    // Base colors
    primary: '#2B0B3F',    // Deep Purple
    secondary: '#FF2D95',  // Neon Pink
    accent: '#00F3FF',     // Electric Blue
    background: '#1A1A2E', // Dark Space
    border: '#FF2D95',     // Neon Pink
    text: '#FFFFFF',       // White
    hover: '#4B1B6F',      // Light Purple

    // Gradients
    gradients: {
      primary: 'linear-gradient(45deg, #2B0B3F 0%, #4B1B6F 100%)',
      accent: 'linear-gradient(45deg, #FF2D95 0%, #00F3FF 100%)',
    },

    // Component-specific colors
    toggle: {
      background: '#1A1A2E',
      circle: '#FF2D95',
    },
    selector: {
      background: 'rgba(43, 11, 63, 0.8)',
      hover: 'rgba(255, 45, 149, 0.2)',
    },

    // Neon effects
    neon: {
      primary: '0 0 10px #FF2D95, 0 0 20px #FF2D95, 0 0 30px #FF2D95',
      accent: '0 0 10px #00F3FF, 0 0 20px #00F3FF, 0 0 30px #00F3FF',
    }
  },
  DARK: {
    // Base colors
    primary: '#1A1A2E',    // Dark Space
    secondary: '#FF2D95',  // Neon Pink
    accent: '#00F3FF',     // Electric Blue
    background: '#0F0F1B', // Deeper Space
    border: '#FF2D95',     // Neon Pink
    text: '#FFFFFF',       // White
    hover: '#2B0B3F',      // Deep Purple

    // Gradients
    gradients: {
      primary: 'linear-gradient(45deg, #1A1A2E 0%, #2B0B3F 100%)',
      accent: 'linear-gradient(45deg, #FF2D95 0%, #00F3FF 100%)',
    },

    // Component-specific colors
    toggle: {
      background: '#0F0F1B',
      circle: '#FF2D95',
    },
    selector: {
      background: 'rgba(26, 26, 46, 0.8)',
      hover: 'rgba(255, 45, 149, 0.2)',
    },

    // Neon effects
    neon: {
      primary: '0 0 10px #FF2D95, 0 0 20px #FF2D95, 0 0 30px #FF2D95',
      accent: '0 0 10px #00F3FF, 0 0 20px #00F3FF, 0 0 30px #00F3FF',
    }
  }
} as const;

// Helper type for theme keys
export type SynthwaveRetroverseModeType = keyof typeof SYNTHWAVE_RETROVERSE_THEMES; 