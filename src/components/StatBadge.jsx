import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, typography, spacing, radius} from '../theme/theme';

/**
 * StatBadge — Before/After stat pill
 */
const StatBadge = ({label, value, sub, accent = 'cyan'}) => {
  const accentColor = colors.accent[accent] || colors.accent.cyan;
  const accentDim = colors.accent[`${accent}Dim`] || colors.accent.cyanDim;

  return (
    <View style={[styles.container, {borderColor: `${accentColor}30`, backgroundColor: accentDim}]}>
      <Text style={[styles.label, {color: accentColor}]}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    minWidth: 100,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  sub: {fontSize: typography.sizes.xs, color: colors.text.secondary, marginTop: 2},
});

export default StatBadge;
