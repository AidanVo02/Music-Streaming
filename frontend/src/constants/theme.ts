/**
 * Nordic Matte Minimal Theme Tokens
 * Aesthetic: Clean graphite matte, soft diffuse shadows, hairline borders, breathable whitespace
 */

export const THEME = {
  colors: {
    // Backgrounds & Surfaces
    background: '#0E0E12',
    backgroundAlt: '#131318',
    surface: '#18181F',
    surfaceSubtle: 'rgba(255, 255, 255, 0.035)',
    surfaceHover: '#20202A',
    surfaceGlass: 'rgba(22, 22, 28, 0.88)',
    surfaceCard: '#15151B',
    
    // Hairline borders
    border: 'rgba(255, 255, 255, 0.07)',
    borderSubtle: 'rgba(255, 255, 255, 0.04)',
    borderHighlight: 'rgba(255, 255, 255, 0.12)',
    borderActive: 'rgba(255, 110, 68, 0.45)',

    // Accents (Nordic warm coral / amber)
    accent: '#FF6E44',
    accentHover: '#FF825E',
    accentMuted: 'rgba(255, 110, 68, 0.14)',
    accentGlow: 'rgba(255, 110, 68, 0.28)',

    // Text & Hierarchy
    textPrimary: '#F5F5F7',
    textSecondary: '#9A9AA6',
    textMuted: '#686876',
    textInverse: '#0E0E12',

    // Status colors
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
  },

  radii: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 28,
    full: 9999,
  },

  shadows: {
    subtle: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 10,
      elevation: 3,
    },
    diffuse: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.28,
      shadowRadius: 20,
      elevation: 6,
    },
    floating: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.4,
      shadowRadius: 28,
      elevation: 10,
    },
    glow: {
      shadowColor: '#FF6E44',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 5,
    },
  },
};

// Convenience shorthand exports for unified color synchronization across all screens
export const ORANGE = THEME.colors.accent;
export const BG_COLOR = THEME.colors.background;
export const CARD_BG = THEME.colors.surfaceCard;
export const BORDER_COLOR = THEME.colors.border;

export default THEME;
