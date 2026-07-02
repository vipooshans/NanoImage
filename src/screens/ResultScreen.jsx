import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, typography, spacing, radius} from '../theme/theme';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import ImagePreview from '../components/ImagePreview';
import StatBadge from '../components/StatBadge';
import {saveToGallery} from '../services/fileService';
import {formatSize, calcReduction, calcReductionNumber, reductionColor} from '../utils/formatSize';

const {width} = Dimensions.get('window');
const PREVIEW_SIZE = (width - spacing.base * 2 - spacing.base) / 2;

const ResultScreen = ({navigation, route}) => {
  const {
    originalUri,
    outputUri,
    originalSize = 0,
    processedSize = 0,
    operation = 'Compress',
    quality,
    format,
    dimensions,
    fromFormat,
    toFormat,
  } = route.params || {};

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const reduction = calcReductionNumber(originalSize, processedSize);
  const reductionStr = calcReduction(originalSize, processedSize);
  const accentKey = reductionColor(reduction);

  const handleSave = useCallback(async () => {
    if (!outputUri) return;
    setSaving(true);
    setSaveError(null);
    try {
      const ext = format || toFormat || 'jpg';
      const filename = `nanoimage_${operation.toLowerCase()}_${Date.now()}.${ext}`;
      const savedPath = await saveToGallery(outputUri, filename);
      setSaved(true);
      Alert.alert('Saved!', 'Image saved to your gallery (NanoImage folder).');
    } catch (err) {
      setSaveError(err.message || 'Failed to save image.');
    } finally {
      setSaving(false);
    }
  }, [outputUri, format, toFormat, operation]);

  const handleShare = useCallback(async () => {
    if (!outputUri) return;
    try {
      await Share.share({
        url: outputUri,
        message: `Optimized with NanoImage — saved ${reductionStr}!`,
      });
    } catch (err) {
      console.warn('Share error:', err);
    }
  }, [outputUri, reductionStr]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg.primary} />
      <Header
        title="Optimization Result"
        subtitle={operation}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Reduction Hero Badge */}
        <LinearGradient
          colors={[`${colors.accent[accentKey]}20`, `${colors.accent[accentKey]}05`]}
          style={[styles.heroBadge, {borderColor: `${colors.accent[accentKey]}40`}]}>
          <Text style={[styles.reductionNumber, {color: colors.accent[accentKey]}]}>
            {reductionStr}
          </Text>
          <Text style={styles.reductionLabel}>Size Reduced</Text>
          {quality && (
            <Text style={styles.qualityLabel}>Quality: {quality}</Text>
          )}
          {fromFormat && toFormat && (
            <Text style={styles.qualityLabel}>
              {fromFormat.toUpperCase()} → {toFormat.toUpperCase()}
            </Text>
          )}
          {dimensions && (
            <Text style={styles.qualityLabel}>
              Output: {dimensions.width} × {dimensions.height} px
            </Text>
          )}
        </LinearGradient>

        {/* Before / After Previews */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Before vs After</Text>
          <View style={styles.compareRow}>
            <View style={[styles.compareItem, {maxWidth: PREVIEW_SIZE}]}>
              <ImagePreview
                uri={originalUri}
                label="Original"
                fileSize={originalSize}
                accent="red"
                style={styles.compareImg}
              />
            </View>
            <View style={styles.vsContainer}>
              <View style={styles.vsBadge}>
                <Text style={styles.vsText}>VS</Text>
              </View>
            </View>
            <View style={[styles.compareItem, {maxWidth: PREVIEW_SIZE}]}>
              <ImagePreview
                uri={outputUri}
                label="Optimized"
                fileSize={processedSize}
                accent="green"
                style={styles.compareImg}
              />
            </View>
          </View>
        </GlassCard>

        {/* File Size Stats */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>File Size Comparison</Text>
          <View style={styles.statsRow}>
            <StatBadge
              label="Before"
              value={formatSize(originalSize)}
              sub="Original"
              accent="red"
            />
            <View style={styles.arrowContainer}>
              <Text style={styles.statsArrow}>→</Text>
              <Text style={[styles.savedLabel, {color: colors.accent[accentKey]}]}>
                -{formatSize(Math.max(0, originalSize - processedSize))}
              </Text>
            </View>
            <StatBadge
              label="After"
              value={formatSize(processedSize)}
              sub="Optimized"
              accent="green"
            />
          </View>
          {/* Reduction Bar */}
          <View style={styles.reductionBarWrapper}>
            <View style={styles.reductionTrack}>
              <View
                style={[
                  styles.reductionFill,
                  {
                    width: `${Math.min(100, reduction)}%`,
                    backgroundColor: colors.accent[accentKey],
                  },
                ]}
              />
            </View>
            <Text style={[styles.reductionPercent, {color: colors.accent[accentKey]}]}>
              {reductionStr} reduced
            </Text>
          </View>
        </GlassCard>

        {/* Save Error */}
        {saveError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {saveError}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsCol}>
          <ActionButton
            label={saved ? 'Saved to Gallery ✓' : 'Save to Gallery'}
            icon={saved ? '✓' : '💾'}
            onPress={handleSave}
            loading={saving}
            disabled={saved || !outputUri}
            variant="green"
          />
          <ActionButton
            label="Share"
            icon="↑"
            onPress={handleShare}
            disabled={!outputUri}
            variant="cyan"
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={styles.homeBtn}>
            <Text style={styles.homeBtnText}>← Back to Home</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: spacing.xxxl}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg.primary},
  scroll: {padding: spacing.base, flexGrow: 1},
  heroBadge: {
    borderRadius: radius.xxl,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.base,
  },
  reductionNumber: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.extrabold,
    letterSpacing: -1,
  },
  reductionLabel: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    fontWeight: typography.weights.medium,
  },
  qualityLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginTop: 4,
  },
  card: {padding: spacing.base, marginBottom: spacing.base},
  cardTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  compareItem: {flex: 1},
  compareImg: {aspectRatio: undefined, height: 180},
  vsContainer: {
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
  },
  vsBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text.secondary,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  arrowContainer: {alignItems: 'center', gap: 4},
  statsArrow: {
    fontSize: typography.sizes.xl,
    color: colors.text.muted,
  },
  savedLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  reductionBarWrapper: {marginTop: spacing.sm},
  reductionTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  reductionFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  reductionPercent: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    textAlign: 'right',
  },
  errorBanner: {
    backgroundColor: colors.accent.redDim,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: `${colors.accent.red}40`,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  errorText: {fontSize: typography.sizes.sm, color: colors.accent.red},
  actionsCol: {gap: spacing.sm, marginTop: spacing.xs},
  homeBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  homeBtnText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
  },
});

export default ResultScreen;
