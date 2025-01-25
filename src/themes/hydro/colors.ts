export const HYDRO_THEMES = {
  LIGHT: {
    // Base colors
    primary: '#4A90E2',    // Ocean Blue
    secondary: '#87CEEB',  // Sky Blue
    background: '#ACE6F4', // Alice Blue
    border: '#B0E0E6',     // Powder Blue
    text: '#2C3E50',       // Dark Blue Gray
    hover: '#E3F2FD',      // Light Blue

    // Component-specific colors
    toggle: {
      background: '#E3F2FD', // Light Blue
      circle: '#4A90E2',     // Ocean Blue
    },
    selector: {
      background: '#E3F2FD', // Light Blue
      hover: '#B3E0FF',      // Lighter Blue
    }
  },
  DARK: {
    // Base colors
    primary: '#1E4976',    // Deep Ocean Blue
    secondary: '#2C5282',  // Navy Blue
    background: '#003154', // Dark Blue Gray
    border: '#2D3748',     // Slate Blue
    text: '#E3F2FD',       // Light Blue
    hover: '#2A4365',      // Deep Blue

    // Component-specific colors
    toggle: {
      background: '#00416A', // Slate Blue
      circle: '#4A90E2',     // Ocean Blue
    },
    selector: {
      background: '#00416A', // Slate Blue
      hover: '#2A4365',      // Deep Blue
    }
  }
} as const;

// Helper type for theme keys
export type HydroThemeMode = keyof typeof HYDRO_THEMES;
