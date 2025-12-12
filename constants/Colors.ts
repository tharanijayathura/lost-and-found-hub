export const lightColors = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#8b5cf6',
  accent: '#ec4899',
  tint: '#6366f1',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1e293b',
  textLight: '#64748b',
  textSecondary: '#94a3b8',
  white: '#ffffff',
  gray: '#94a3b8',
  grayLight: '#e2e8f0',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  card: '#ffffff',
  border: '#e2e8f0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  favorite: '#ef4444',
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
