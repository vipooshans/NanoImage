import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, typography, spacing, radius, glass} from '../theme/theme';
import {formatSize} from '../utils/formatSize';

/**
 * ImagePreview — Image thumbnail card with filename + size overlay
 */
const ImagePreview = ({uri, label, fileSize, accent, onPress, style}) => {
  const accentColor = accent ? colors.accent[accent] : null;
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.container,
        accentColor && {borderColor: `${accentColor}40`},
        style,
      ]}>
      {uri ? (
        <Image source={{uri}} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>🖼️</Text>
          <Text style={styles.placeholderText}>No image</Text>
        </View>
      )}
      {(label || fileSize) && (
        <View style={styles.overlay}>
          {label ? (
            <Text style={[styles.label, accentColor && {color: accentColor}]}>{label}</Text>
          ) : null}
          {fileSize ? (
            <Text style={styles.size}>{formatSize(fileSize)}</Text>
          ) : null}
        </View>
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    ...glass.base,
    overflow: 'hidden',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  image: {width: '100%', aspectRatio: 1},
  placeholder: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  placeholderIcon: {fontSize: 36, marginBottom: spacing.xs},
  placeholderText: {fontSize: typography.sizes.sm, color: colors.text.muted},
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(8,12,20,0.75)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.accent.cyan,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  size: {fontSize: typography.sizes.xs, fontWeight: typography.weights.medium, color: colors.text.secondary},
});

export default ImagePreview;
