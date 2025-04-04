export const SYNTHWAVE_RETROVERSE_FONTS = {
  header: {
    family: "'Orbitron', sans-serif",
    url: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap',
  },
  body: {
    family: "'Space Grotesk', sans-serif",
    url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap',
  },
  size: {
    small: '14px',
    normal: '16px',
    large: '20px',
    xlarge: '24px',
    xxlarge: '32px',
  },
  weight: {
    light: 300,
    normal: 400,
    medium: 500,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  }
} as const;

export const loadSynthwaveRetroverseFont = async () => {
  const fonts = [SYNTHWAVE_RETROVERSE_FONTS.header.url, SYNTHWAVE_RETROVERSE_FONTS.body.url];
  
  for (const fontUrl of fonts) {
    // Check if font is already loaded
    const fontAlreadyLoaded = document.querySelector(`link[href="${fontUrl}"]`);
    if (fontAlreadyLoaded) continue;

    // Create and load font
    const fontLink = document.createElement('link');
    fontLink.href = fontUrl;
    fontLink.rel = 'stylesheet';
    
    // Add to document head
    document.head.appendChild(fontLink);
  }

  // Wait for fonts to load
  await document.fonts.ready;
}; 