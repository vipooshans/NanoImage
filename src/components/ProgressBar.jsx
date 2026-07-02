import React, {useRef, useEffect} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {colors, typography, spacing, radius} from '../theme/theme';

/**
 * ProgressBar — Animated progress bar with percentage label
 */
const ProgressBar = ({progress = 0, color = 'cyan', showLabel = true, label, style}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: Math.max(0, Math.min(1, progress)),
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  const barColor = colors.accent[color] || colors.accent.cyan;
  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
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
          style={[styles.fill, {width: widthInterpolate, backgroundColor: barColor, shadowColor: barColor}]}
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
    height: 6,
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
