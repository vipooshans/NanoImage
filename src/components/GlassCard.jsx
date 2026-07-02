import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors, glass, radius, shadows} from '../theme/theme';

/**
 * GlassCard — Glassmorphism card container with optional neon glow accent
 * @param {object} props
 * @param {'cyan'|'purple'|'green'|'orange'} [props.accent] - neon glow color
 * @param {object} [props.style] - additional styles
 * @param {React.ReactNode} props.children
 */
const GlassCard = ({accent, style, children}) => {
  const accentShadow = accent ? shadows[accent] : shadows.card;
  const accentBorder = accent
    ? {borderColor: `${colors.accent[accent]}30`}
    : {};

  return (
    <View style={[styles.card, accentShadow, accentBorder, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...glass.card,
    overflow: 'hidden',
  },
});

export default GlassCard;
