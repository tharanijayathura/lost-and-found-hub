export const lightColors = {
  primary: '#FE7743',
  primaryDark: '#273F4F',
  secondary: '#447D9B',
  accent: '#FE7743',
  tint: '#FE7743',
  background: '#FDF7F4',
  surface: '#ffffff',
  text: '#273F4F',
  textLight: '#5E7A8E',
  textSecondary: '#8CA2B3',
  white: '#ffffff',
  gray: '#D7D7D7',
  grayLight: '#F0F0F0',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  card: '#ffffff',
  border: '#E5E5E5',
  shadow: 'rgba(39, 63, 79, 0.1)',
  favorite: '#FE7743',
};

export const darkColors = {
  primary: '#818cf8',
  primaryDark: '#6366f1',
  secondary: '#a78bfa',
  accent: '#f472b6',
  tint: '#818cf8',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f1f5f9',
  textLight: '#cbd5e1',
  textSecondary: '#94a3b8',
  white: '#ffffff',
  gray: '#64748b',
  grayLight: '#334155',
  success: '#10b981',
  error: '#f87171',
  warning: '#fbbf24',
  card: '#1e293b',
  border: '#334155',
  shadow: 'rgba(0, 0, 0, 0.3)',
  favorite: '#f87171',
};

export type ColorScheme = typeof lightColors;

export const Colors = {
  light: lightColors,
  dark: darkColors,
  ...lightColors,
} as const;

export default Colors;
