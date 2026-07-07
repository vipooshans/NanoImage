import React, {useState, useCallback} from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, Alert, TouchableOpacity,
} from 'react-native';
import Animated, {FadeIn, FadeOut, Layout} from 'react-native-reanimated';
import {launchImageLibrary} from 'react-native-image-picker';
import {colors, typography, spacing, radius} from '../theme/theme';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import ImagePreview from '../components/ImagePreview';
import QualitySlider from '../components/QualitySlider';
import ProgressBar from '../components/ProgressBar';
import {compressImage} from '../services/compressionService';
import {getFileSize} from '../services/fileService';
import {requestStoragePermissions} from '../utils/permissionsHelper';
import {formatSize} from '../utils/formatSize';

const CompressScreen = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const pickImage = useCallback(async () => {
    setError(null);
    const granted = await requestStoragePermissions();
    if (!granted) { setError('Storage permission is required.'); return; }
    const result = await launchImageLibrary({mediaType: 'photo', quality: 1});
    if (result.didCancel) return;
    const asset = result.assets?.[0];
    if (asset) {
      const size = await getFileSize(asset.uri);
      setImage({uri: asset.uri, name: asset.fileName, size: size || asset.fileSize || 0});
    }
  }, []);

  const handleCompress = useCallback(async () => {
    if (!image) return;
    setLoading(true); setProgress(0.1); setError(null);
    try {
      setProgress(0.3);
      const result = await compressImage(image.uri, quality);
      setProgress(1);
      setTimeout(() => {
        navigation.navigate('Result', {
          originalUri: image.uri, outputUri: result.outputUri,
          originalSize: result.originalSize, processedSize: result.compressedSize,
          operation: 'Compress', quality, format: result.format,
        });
        setLoading(false); setProgress(0);
      }, 400);
    } catch (err) {
      setError(err.message || 'Compression failed.'); setLoading(false); setProgress(0);
    }
  }, [image, quality, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg.primary} />
      <Header title="Compress Image" subtitle="Reduce file size" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard accent="cyan" style={styles.card}>
          <Text style={styles.cardTitle}>Select Image</Text>
          <TouchableOpacity onPress={pickImage} style={styles.pickArea}>
            {image ? (
              <ImagePreview uri={image.uri} label="Original" fileSize={image.size} accent="cyan" style={styles.preview} />
            ) : (
              <View style={styles.emptyPick}>
                <Text style={styles.pickIcon}>📁</Text>
                <Text style={styles.pickText}>Tap to select image</Text>
                <Text style={styles.pickSub}>JPEG, PNG, WebP supported</Text>
              </View>
            )}
          </TouchableOpacity>
          {image && (
            <TouchableOpacity onPress={pickImage} style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>Change Image</Text>
            </TouchableOpacity>
          )}
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Compression Quality</Text>
          <QualitySlider value={quality} onChange={setQuality} color="cyan" style={styles.slider} />
          <View style={styles.previewSizes}>
            <View style={styles.sizeInfo}>
              <Text style={styles.sizeLabel}>Original Size</Text>
              <Text style={[styles.sizeValue, {color: colors.accent.cyan}]}>
                {image ? formatSize(image.size) : '—'}
              </Text>
            </View>
            <Text style={styles.sizeArrow}>→</Text>
            <View style={styles.sizeInfo}>
              <Text style={styles.sizeLabel}>Est. Output</Text>
              <Text style={[styles.sizeValue, {color: colors.accent.green}]}>
                {image ? formatSize(Math.round(image.size * (quality / 100) * 0.7)) : '—'}
              </Text>
            </View>
          </View>
        </GlassCard>

        {loading && (
          <Animated.View entering={FadeIn} exiting={FadeOut} layout={Layout.springify()}>
            <GlassCard style={styles.card}>
              <ProgressBar progress={progress} color="cyan" label="Compressing..." />
            </GlassCard>
          </Animated.View>
        )}

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        <ActionButton label="Compress Now" icon="⚡" onPress={handleCompress} loading={loading} disabled={!image} variant="cyan" style={styles.cta} />
        <View style={{height: spacing.xxxl}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg.primary},
  scroll: {padding: spacing.base, flexGrow: 1},
  card: {padding: spacing.base, marginBottom: spacing.base},
  cardTitle: {fontSize: typography.sizes.base, fontWeight: typography.weights.semibold, color: colors.text.primary, marginBottom: spacing.md},
  pickArea: {borderRadius: radius.lg, overflow: 'hidden'},
  emptyPick: {
    height: 180, backgroundColor: 'rgba(0,245,255,0.04)', borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(0,245,255,0.2)', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
  },
  pickIcon: {fontSize: 36},
  pickText: {fontSize: typography.sizes.base, color: colors.accent.cyan, fontWeight: typography.weights.medium},
  pickSub: {fontSize: typography.sizes.sm, color: colors.text.muted},
  preview: {height: 220},
  changeBtn: {marginTop: spacing.sm, alignItems: 'center', paddingVertical: spacing.xs},
  changeBtnText: {fontSize: typography.sizes.sm, color: colors.accent.cyan, fontWeight: typography.weights.medium},
  slider: {marginTop: spacing.xs},
  previewSizes: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    marginTop: spacing.base, paddingTop: spacing.base, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)',
  },
  sizeInfo: {alignItems: 'center'},
  sizeLabel: {fontSize: typography.sizes.xs, color: colors.text.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5},
  sizeValue: {fontSize: typography.sizes.lg, fontWeight: typography.weights.bold},
  sizeArrow: {fontSize: typography.sizes.xl, color: colors.text.muted},
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.accent.redDim,
    borderRadius: radius.md, borderWidth: 1, borderColor: `${colors.accent.red}40`, padding: spacing.md, marginBottom: spacing.base,
  },
  errorText: {flex: 1, fontSize: typography.sizes.sm, color: colors.accent.red},
  cta: {marginTop: spacing.xs},
});

export default CompressScreen;
