import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Animated, {FadeInDown, Layout} from 'react-native-reanimated';
import {launchImageLibrary} from 'react-native-image-picker';
import {colors, typography, spacing, radius} from '../theme/theme';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import QualitySlider from '../components/QualitySlider';
import ProgressBar from '../components/ProgressBar';
import {processBatch, getBatchSummary} from '../services/batchService';
import {getFileSize} from '../services/fileService';
import {requestStoragePermissions} from '../utils/permissionsHelper';
import {formatSize, calcReduction} from '../utils/formatSize';

const STATUS_COLORS = {
  pending: colors.text.muted,
  processing: colors.accent.purple,
  done: colors.accent.green,
  error: colors.accent.red,
};

const STATUS_ICONS = {
  pending: '○',
  processing: '◌',
  done: '✓',
  error: '✕',
};

const BatchItem = ({item, index = 0}) => {
  const statusColor = STATUS_COLORS[item.status] || colors.text.muted;
  const icon = STATUS_ICONS[item.status] || '○';

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 50).springify()} 
      layout={Layout.springify()}
      style={styles.batchItem}
    >
      <View style={[styles.statusDot, {backgroundColor: item.status === 'processing' ? 'transparent' : statusColor}]}>
        {item.status === 'processing' ? (
          <ActivityIndicator size="small" color={colors.accent.purple} />
        ) : (
          <Text style={styles.statusDotText}>{icon}</Text>
        )}
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name || 'Image'}
        </Text>
        {item.status === 'done' && item.originalSize && item.compressedSize ? (
          <Text style={styles.itemStats}>
            {formatSize(item.originalSize)} → {formatSize(item.compressedSize)}{' '}
            <Text style={{color: colors.accent.green}}>
              ({calcReduction(item.originalSize, item.compressedSize)} saved)
            </Text>
          </Text>
        ) : item.status === 'error' ? (
          <Text style={styles.itemError}>{item.error}</Text>
        ) : (
          <Text style={styles.itemPending}>{item.status}</Text>
        )}
      </View>
      <Text style={[styles.statusLabel, {color: statusColor}]}>
        {item.status.toUpperCase()}
      </Text>
    </Animated.View>
  );
};

const BatchScreen = ({navigation}) => {
  const [images, setImages] = useState([]);
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const cancelledRef = useRef(false);

  const pickImages = useCallback(async () => {
    setError(null);
    const granted = await requestStoragePermissions();
    if (!granted) {
      setError('Storage permission is required.');
      return;
    }
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 20,
    });
    if (result.didCancel) return;
    if (result.assets && result.assets.length > 0) {
      const items = await Promise.all(
        result.assets.map(async asset => ({
          uri: asset.uri,
          name: asset.fileName || 'image',
          status: 'pending',
          originalSize: await getFileSize(asset.uri),
        })),
      );
      setImages(items);
      setResults([]);
    }
  }, []);

  const handleStart = useCallback(async () => {
    if (images.length === 0) return;
    cancelledRef.current = false;
    setLoading(true);
    setProgress(0);
    setError(null);
    // Seed results with pending state
    const initial = images.map(img => ({...img, status: 'pending'}));
    setResults(initial);

    const processed = await processBatch(images, quality, {
      onItemStart: (index, item) => {
        setResults(prev => {
          const next = [...prev];
          next[index] = {...item, status: 'processing'};
          return next;
        });
      },
      onItemComplete: (index, item) => {
        setResults(prev => {
          const next = [...prev];
          next[index] = item;
          return next;
        });
      },
      onProgress: p => setProgress(p),
      isCancelled: () => cancelledRef.current,
    });

    setLoading(false);

    if (!cancelledRef.current) {
      const summary = getBatchSummary(processed);
      setResults(processed);
      // Navigate to a batch summary view or show inline
    }
  }, [images, quality]);

  const handleCancel = useCallback(() => {
    cancelledRef.current = true;
    setLoading(false);
  }, []);

  const displayList = results.length > 0 ? results : images;
  const summary = results.length > 0 ? getBatchSummary(results) : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg.primary} />
      <Header
        title="Batch Compress"
        subtitle="Process multiple images"
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Image Selection */}
        <GlassCard accent="orange" style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Image Queue</Text>
            <Text style={[styles.countBadge, {color: colors.accent.orange}]}>
              {displayList.length} {displayList.length === 1 ? 'image' : 'images'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={pickImages}
            disabled={loading}
            style={styles.pickBtn}>
            <Text style={styles.pickBtnIcon}>+</Text>
            <Text style={[styles.pickBtnText, {color: colors.accent.orange}]}>
              {images.length > 0 ? 'Change Selection' : 'Select Images (up to 20)'}
            </Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Image List */}
        {displayList.length > 0 && (
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>Queue Status</Text>
            {displayList.map((item, index) => (
              <BatchItem key={`${item.uri}-${index}`} item={item} index={index} />
            ))}
          </GlassCard>
        )}

        {/* Quality */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Compression Quality</Text>
          <QualitySlider
            value={quality}
            onChange={setQuality}
            color="orange"
            style={styles.slider}
          />
        </GlassCard>

        {/* Overall Progress */}
        {(loading || progress > 0) && (
          <GlassCard style={styles.card}>
            <ProgressBar
              progress={progress}
              color="orange"
              label={loading ? 'Batch Compressing...' : 'Complete'}
            />
          </GlassCard>
        )}

        {/* Summary */}
        {summary && !loading && (
          <GlassCard accent="green" style={styles.card}>
            <Text style={styles.cardTitle}>Batch Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, {color: colors.accent.green}]}>
                  {summary.successCount}
                </Text>
                <Text style={styles.summaryLabel}>Processed</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, {color: colors.accent.red}]}>
                  {summary.errorCount}
                </Text>
                <Text style={styles.summaryLabel}>Failed</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, {color: colors.accent.cyan}]}>
                  {formatSize(summary.totalOriginal - summary.totalCompressed)}
                </Text>
                <Text style={styles.summaryLabel}>Total Saved</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, {color: colors.accent.orange}]}>
                  {calcReduction(summary.totalOriginal, summary.totalCompressed)}
                </Text>
                <Text style={styles.summaryLabel}>Reduction</Text>
              </View>
            </View>
          </GlassCard>
        )}

        {/* Error */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Actions */}
        {loading ? (
          <ActionButton
            label="Cancel Batch"
            icon="✕"
            onPress={handleCancel}
            variant="orange"
            style={styles.cta}
          />
        ) : (
          <ActionButton
            label={results.length > 0 ? 'Run Again' : 'Start Batch'}
            icon="⊛"
            onPress={handleStart}
            loading={false}
            disabled={images.length === 0}
            variant="orange"
            style={styles.cta}
          />
        )}

        <View style={{height: spacing.xxxl}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg.primary},
  scroll: {padding: spacing.base, flexGrow: 1},
  card: {padding: spacing.base, marginBottom: spacing.base},
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  countBadge: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,159,10,0.08)',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,159,10,0.25)',
    borderStyle: 'dashed',
    padding: spacing.md,
  },
  pickBtnIcon: {
    fontSize: 24,
    color: colors.accent.orange,
    fontWeight: typography.weights.light,
  },
  pickBtnText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  batchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: spacing.sm,
  },
  statusDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDotText: {
    fontSize: 13,
    color: colors.bg.primary,
    fontWeight: typography.weights.bold,
  },
  itemInfo: {flex: 1},
  itemName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: 2,
  },
  itemStats: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  itemError: {
    fontSize: typography.sizes.xs,
    color: colors.accent.red,
  },
  itemPending: {
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    textTransform: 'capitalize',
  },
  statusLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    letterSpacing: 0.5,
  },
  slider: {marginTop: spacing.xs},
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  summaryItem: {
    flex: 1,
    minWidth: '40%',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  summaryValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  cta: {marginTop: spacing.xs},
});

export default BatchScreen;
