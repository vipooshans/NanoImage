import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, typography, spacing} from '../theme/theme';

/**
 * Header — Shared screen header with back button
 */
const Header = ({title, subtitle, onBack, rightElement}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backBtn}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        ) : null}
      </View>
      <View style={styles.right}>{rightElement || null}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    minHeight: 60,
  },
  left: {width: 44, alignItems: 'flex-start'},
  center: {flex: 1, alignItems: 'center'},
  right: {width: 44, alignItems: 'flex-end'},
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 26,
    color: colors.text.primary,
    lineHeight: 30,
    fontWeight: typography.weights.light,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
});

export default Header;
