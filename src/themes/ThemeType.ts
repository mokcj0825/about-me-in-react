export const AVAILABLE_THEMES = ['dull', 'hydro', 'synthwave-retroverse'] as const;
export type ThemeType = typeof AVAILABLE_THEMES[number];