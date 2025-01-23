export const DULL_THEMES = {
  LIGHT: {
    // Base colors
    primary: '#808080',    // Gray
    secondary: '#A9A9A9',  // Dark Gray
    background: '#F5F5F5', // White Smoke
    border: '#696969',     // Dim Gray
    text: '#404040',       // Dark Gray
    hover: '#C0C0C0',      // Silver

    // Component-specific colors
    toggle: {
      background: '#D3D3D3', // Light Gray
      circle: '#808080',     // Gray
    },
    selector: {
      background: '#D3D3D3', // Light Gray
      hover: '#C0C0C0',      // Silver
    }
  },
  DARK: {
    // Base colors
    primary: '#404040',    // Darker Gray
    secondary: '#2F2F2F',  // Very Dark Gray
    background: '#1A1A1A', // Almost Black
    border: '#4D4D4D',     // Medium Dark Gray
    text: '#D3D3D3',       // Light Gray
    hover: '#363636',      // Slightly lighter than background

    // Component-specific colors
    toggle: {
      background: '#1A1A1A', // Almost Black
      circle: '#A9A9A9',     // Dark Gray
    },
    selector: {
      background: '#1A1A1A', // Almost Black
      hover: '#363636',      // Slightly lighter than background
    }
  }
} as const;

// Helper type for theme keys
export type DullThemeMode = keyof typeof DULL_THEMES;
