/**
 * NanoImage Design System
 * Dark futuristic theme with glassmorphism + neon accents
 */

export const colors = {
  // Background layers
  bg: {
    primary: '#080C14',
    secondary: '#0D1220',
    card: 'rgba(255, 255, 255, 0.04)',
    cardBorder: 'rgba(255, 255, 255, 0.10)',
    overlay: 'rgba(8, 12, 20, 0.85)',
  },

  // Neon accent palette
  accent: {
    cyan: '#00F5FF',
    cyanDim: 'rgba(0, 245, 255, 0.15)',
    cyanGlow: 'rgba(0, 245, 255, 0.35)',
    purple: '#BF5AF2',
    purpleDim: 'rgba(191, 90, 242, 0.15)',
    purpleGlow: 'rgba(191, 90, 242, 0.35)',
    green: '#30D158',
    greenDim: 'rgba(48, 209, 88, 0.15)',
    orange: '#FF9F0A',
    orangeDim: 'rgba(255, 159, 10, 0.15)',
    red: '#FF453A',
    redDim: 'rgba(255, 69, 58, 0.15)',
  },

  // Gradients (as arrays for LinearGradient)
  gradient: {
    hero: ['#0D1220', '#080C14'],
    cyan: ['#00F5FF', '#0080FF'],
    purple: ['#BF5AF2', '#6E40C9'],
    cyanPurple: ['#00F5FF', '#BF5AF2'],
    green: ['#30D158', '#25A244'],
    orange: ['#FF9F0A', '#FF6B00'],
    card: ['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)'],
  },

  // Text
  text: {
    primary: '#F0F4FF',
    secondary: '#8896B0',
    muted: '#4A5568',
    inverse: '#080C14',
  },

  // Status
  status: {
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#00F5FF',
    pending: '#8896B0',
    processing: '#BF5AF2',
  },

  white: '#FFFFFF',
  transparent: 'transparent',
};

export const typography = {
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    mono: 'monospace',
  },
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 30,
    xxxl: 38,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const shadows = {
  cyan: {
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  purple: {
    shadowColor: '#BF5AF2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  green: {
    shadowColor: '#30D158',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  orange: {
    shadowColor: '#FF9F0A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const glass = {
  base: {
    backgroundColor: colors.bg.card,
    borderWidth: 1,
    borderColor: colors.bg.cardBorder,
    borderRadius: radius.lg,
  },
  strong: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: radius.lg,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: radius.xl,
  },
};

export default {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  glass,
};
