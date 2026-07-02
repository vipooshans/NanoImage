import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, typography, spacing, radius} from '../theme/theme';

/**
 * ActionButton — Primary CTA button with gradient fill and optional loading state
 */
const ActionButton = ({
  label,
  onPress,
  variant = 'cyan',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const gradientColors = colors.gradient[variant] || colors.gradient.cyan;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.wrapper, disabled && styles.disabled, style]}>
      <LinearGradient
        colors={disabled ? ['#2A3040', '#1E2535'] : gradientColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradient}>
        {loading ? (
          <ActivityIndicator color={colors.text.inverse} size="small" />
        ) : (
          <View style={styles.row}>
            {icon ? <Text style={styles.icon}>{icon}</Text> : null}
            <Text style={styles.label}>{label}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {fontSize: 18},
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.inverse,
    letterSpacing: 0.5,
  },
  disabled: {opacity: 0.5},
});

export default ActionButton;
