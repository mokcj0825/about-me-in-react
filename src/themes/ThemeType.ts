export const AVAILABLE_THEMES = ['dull', 'hydro'] as const;
export type ThemeType = typeof AVAILABLE_THEMES[number];