import React, {useRef, useCallback} from 'react';
import {View, Text, StyleSheet, PanResponder} from 'react-native';
import {colors, typography, spacing, radius} from '../theme/theme';

/**
 * QualitySlider — Custom touch-driven quality slider (1-100)
 */
const QualitySlider = ({value = 80, onChange, min = 1, max = 100, color = 'cyan', label = 'Quality', style}) => {
  const trackWidth = useRef(0);
  const accentColor = colors.accent[color] || colors.accent.cyan;

  const clamp = useCallback(v => Math.min(max, Math.max(min, Math.round(v))), [min, max]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const x = evt.nativeEvent.locationX;
        if (trackWidth.current > 0) {
          onChange && onChange(clamp(min + (x / trackWidth.current) * (max - min)));
        }
      },
      onPanResponderMove: evt => {
        const x = evt.nativeEvent.locationX;
        if (trackWidth.current > 0) {
          const ratio = Math.max(0, Math.min(1, x / trackWidth.current));
          onChange && onChange(clamp(min + ratio * (max - min)));
        }
      },
    }),
  ).current;

  const ratio = (value - min) / (max - min);

  const getQualityLabel = () => {
    if (value >= 80) return {text: 'High Quality', color: colors.accent.green};
    if (value >= 50) return {text: 'Balanced', color: colors.accent.cyan};
    if (value >= 25) return {text: 'Compressed', color: colors.accent.orange};
    return {text: 'Max Compression', color: colors.accent.red};
  };

  const qualityInfo = getQualityLabel();

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, {color: accentColor}]}>{value}</Text>
          <Text style={styles.maxLabel}>/ {max}</Text>
        </View>
      </View>
      <View
        style={styles.track}
        onLayout={e => {trackWidth.current = e.nativeEvent.layout.width;}}
        {...panResponder.panHandlers}>
        <View style={styles.trackBg} />
        <View style={[styles.fill, {width: `${ratio * 100}%`, backgroundColor: accentColor}]} />
        <View style={[styles.thumb, {left: `${ratio * 100}%`, backgroundColor: accentColor, shadowColor: accentColor}]} />
      </View>
      <View style={styles.ticks}>
        <Text style={styles.tickLabel}>{min}</Text>
        <Text style={[styles.qualityLabel, {color: qualityInfo.color}]}>{qualityInfo.text}</Text>
        <Text style={styles.tickLabel}>{max}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {width: '100%'},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md},
  label: {fontSize: typography.sizes.base, fontWeight: typography.weights.semibold, color: colors.text.primary},
  valueRow: {flexDirection: 'row', alignItems: 'baseline'},
  value: {fontSize: typography.sizes.xl, fontWeight: typography.weights.bold},
  maxLabel: {fontSize: typography.sizes.sm, color: colors.text.muted, marginLeft: 2},
  track: {height: 24, justifyContent: 'center', position: 'relative'},
  trackBg: {
    position: 'absolute', height: 6, borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)', left: 0, right: 0, top: 9,
  },
  fill: {position: 'absolute', height: 6, borderRadius: radius.full, top: 9, left: 0},
  thumb: {
    position: 'absolute', width: 22, height: 22, borderRadius: 11, top: 1, marginLeft: -11,
    borderWidth: 3, borderColor: colors.bg.primary,
    shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.8, shadowRadius: 8, elevation: 6, zIndex: 10,
  },
  ticks: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs},
  tickLabel: {fontSize: typography.sizes.xs, color: colors.text.muted},
  qualityLabel: {fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold},
});

export default QualitySlider;
