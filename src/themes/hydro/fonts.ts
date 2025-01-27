export const HYDRO_FONTS = {
  family: "'Parisienne', cursive, Arial, sans-serif",
  url: 'https://fonts.googleapis.com/css2?family=Parisienne&display=swap',
  size: {
    small: '12px',
    normal: '14px',
    large: '16px'
  },
  weight: {
    normal: 400,
    bold: 700
  }
} as const;

export const loadHydroFont = async () => {
  // Check if font is already loaded
  const fontAlreadyLoaded = document.querySelector('link[href="' + HYDRO_FONTS.url + '"]');
  if (fontAlreadyLoaded) return;

  // Create and load font
  const fontLink = document.createElement('link');
  fontLink.href = HYDRO_FONTS.url;
  fontLink.rel = 'stylesheet';
  
  // Add to document head
  document.head.appendChild(fontLink);

  // Wait for font to load
  await document.fonts.ready;
};