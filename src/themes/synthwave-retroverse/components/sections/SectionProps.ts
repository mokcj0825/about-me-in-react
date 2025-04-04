import { SYNTHWAVE_RETROVERSE_THEMES } from '../../colors';

export interface SectionProps {
  darkMode: boolean;
}

export interface StyledSectionProps {
  darkMode: boolean;
}

export const getSectionColors = (darkMode: boolean) => ({
  text: darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.text 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.text,
  accent: darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.accent 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.accent,
  secondary: darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.secondary 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.secondary,
}); 