import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {colors, typography, spacing, radius} from '../theme/theme';

/**
 * ProgressBar — Animated progress bar with percentage label using Reanimated
 */
const ProgressBar = ({progress = 0, color = 'cyan', showLabel = true, label, style}) => {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    // Animate progress change smoothly
    animatedProgress.value = withSpring(Math.max(0, Math.min(1, progress)), {
      damping: 20,
      stiffness: 90,
    });
  }, [progress, animatedProgress]);

  const barColor = colors.accent[color] || colors.accent.cyan;
  
  const fillStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value * 100}%`,
    };
  });

  return (
    <View style={[styles.wrapper, style]}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>{label || 'Progress'}</Text>
          <Text style={[styles.percentText, {color: barColor}]}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      )}
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {backgroundColor: barColor, shadowColor: barColor},
            fillStyle
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {width: '100%'},
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  labelText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
  },
  percentText: {fontSize: typography.sizes.sm, fontWeight: typography.weights.bold},
  track: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
});

export default ProgressBar;
