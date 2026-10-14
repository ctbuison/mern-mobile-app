import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  primary: '#1e6fd9',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#1a1a1a',
  muted: '#666666',
  border: '#dddddd',
  success: '#0a7d3b',
  danger: '#c62828',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  pill: 20,
};

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    onPrimary: '#ffffff',
    primaryContainer: '#d6e6fb',
    onPrimaryContainer: '#0b3d80',
    secondaryContainer: '#d6e6fb',
    onSecondaryContainer: '#0b3d80',
    background: colors.background,
    surface: colors.surface,
    error: colors.danger,
  },
};