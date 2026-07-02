import React, {useState, useCallback} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, StatusBar, TouchableOpacity, Switch,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {colors, typography, spacing, radius} from '../theme/theme';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import ImagePreview from '../components/ImagePreview';
import ProgressBar from '../components/ProgressBar';
import {resizeImage, calcProportionalHeight, calcProportionalWidth} from '../services/resizeService';
import {getFileSize} from '../services/fileService';
import {requestStoragePermissions} from '../utils/permissionsHelper';

const ResizeScreen = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [origDims, setOrigDims] = useState({width: 0, height: 0});
  const [targetWidth, setTargetWidth] = useState('');
  const [targetHeight, setTargetHeight] = useState('');
  const [lockAspect, setLockAspect] = useState(true);
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
      const w = asset.width || 0; const h = asset.height || 0;
      setImage({uri: asset.uri, name: asset.fileName, size});
      setOrigDims({width: w, height: h});
      setTargetWidth(String(w)); setTargetHeight(String(h));
    }
  }, []);

  const handleWidthChange = useCallback(val => {
    setTargetWidth(val);
    if (lockAspect && origDims.width && origDims.height) {
      const w = parseInt(val, 10) || 0;
      const h = calcProportionalHeight(origDims.width, origDims.height, w);
      setTargetHeight(h > 0 ? String(h) : '');
    }
  }, [lockAspect, origDims]);

  const handleHeightChange = useCallback(val => {
    setTargetHeight(val);
    if (lockAspect && origDims.width && origDims.height) {
      const h = parseInt(val, 10) || 0;
      const w = calcProportionalWidth(origDims.width, origDims.height, h);
      setTargetWidth(w > 0 ? String(w) : '');
    }
  }, [lockAspect, origDims]);

  const handleResize = useCallback(async () => {
    if (!image) return;
    const w = parseInt(targetWidth, 10); const h = parseInt(targetHeight, 10);
    if (!w || !h || w < 1 || h < 1) { setError('Please enter valid width and height values.'); return; }
    setLoading(true); setProgress(0.2); setError(null);
    try {
      setProgress(0.5);
      const result = await resizeImage(image.uri, w, h);
      setProgress(1);
      setTimeout(() => {
        navigation.navigate('Result', {
          originalUri: image.uri, outputUri: result.outputUri,
          originalSize: result.originalSize, processedSize: result.resizedSize,
          operation: 'Resize', dimensions: {width: result.width, height: result.height},
          format: result.format,
        });
        setLoading(false); setProgress(0);
      }, 400);
    } catch (err) {
      setError(err.message || 'Resize failed.'); setLoading(false); setProgress(0);
    }
  }, [image, targetWidth, targetHeight, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg.primary} />
      <Header title="Resize Image" subtitle="Custom dimensions" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard accent="purple" style={styles.card}>
          <Text style={styles.cardTitle}>Select Image</Text>
          <TouchableOpacity onPress={pickImage} style={styles.pickArea}>
            {image ? (
              <ImagePreview
                uri={image.uri}
                label={origDims.width ? `${origDims.width} × ${origDims.height}` : 'Original'}
                fileSize={image.size} accent="purple" style={styles.preview}
              />
            ) : (
              <View style={styles.emptyPick}>
                <Text style={styles.pickIcon}>⊞</Text>
                <Text style={[styles.pickText, {color: colors.accent.purple}]}>Tap to select image</Text>
                <Text style={styles.pickSub}>JPEG, PNG, WebP supported</Text>
              </View>
            )}
          </TouchableOpacity>
          {image && (
            <TouchableOpacity onPress={pickImage} style={styles.changeBtn}>
              <Text style={[styles.changeBtnText, {color: colors.accent.purple}]}>Change Image</Text>
            </TouchableOpacity>
          )}
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.dimHeader}>
            <Text style={styles.cardTitle}>Target Dimensions</Text>
            <View style={styles.lockRow}>
              <Text style={styles.lockLabel}>Lock ratio</Text>
              <Switch
                value={lockAspect} onValueChange={setLockAspect}
                trackColor={{false: 'rgba(255,255,255,0.1)', true: colors.accent.purple}}
                thumbColor={colors.text.primary}
              />
            </View>
          </View>
          <View style={styles.dimRow}>
            <View style={styles.dimField}>
              <Text style={styles.dimLabel}>Width (px)</Text>
              <TextInput
                style={styles.dimInput} value={targetWidth} onChangeText={handleWidthChange}
                keyboardType="numeric" placeholder="0" placeholderTextColor={colors.text.muted}
              />
            </View>
            <Text style={styles.dimX}>×</Text>
            <View style={styles.dimField}>
              <Text style={styles.dimLabel}>Height (px)</Text>
              <TextInput
                style={styles.dimInput} value={targetHeight} onChangeText={handleHeightChange}
                keyboardType="numeric" placeholder="0" placeholderTextColor={colors.text.muted}
              />
            </View>
          </View>
          <Text style={styles.presetsLabel}>Presets</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsRow}>
            {[
              {w: 1920, h: 1080, label: 'FHD'}, {w: 1280, h: 720, label: 'HD'},
              {w: 800, h: 600, label: 'Web'}, {w: 400, h: 400, label: 'Thumb'}, {w: 320, h: 240, label: 'Small'},
            ].map(preset => (
              <TouchableOpacity key={preset.label} onPress={() => { setTargetWidth(String(preset.w)); setTargetHeight(String(preset.h)); }} style={styles.presetBtn}>
                <Text style={styles.presetLabel}>{preset.label}</Text>
                <Text style={styles.presetDim}>{preset.w}×{preset.h}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </GlassCard>

        {loading && <GlassCard style={styles.card}><ProgressBar progress={progress} color="purple" label="Resizing..." /></GlassCard>}
        {error && <View style={styles.errorBanner}><Text style={styles.errorText}>⚠️ {error}</Text></View>}

        <ActionButton label="Resize Now" icon="⊞" onPress={handleResize} loading={loading} disabled={!image} variant="purple" style={styles.cta} />
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
    height: 180, backgroundColor: 'rgba(191,90,242,0.04)', borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(191,90,242,0.2)', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
  },
  pickIcon: {fontSize: 36},
  pickText: {fontSize: typography.sizes.base, fontWeight: typography.weights.medium},
  pickSub: {fontSize: typography.sizes.sm, color: colors.text.muted},
  preview: {height: 200},
  changeBtn: {marginTop: spacing.sm, alignItems: 'center', paddingVertical: spacing.xs},
  changeBtnText: {fontSize: typography.sizes.sm, fontWeight: typography.weights.medium},
  dimHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md},
  lockRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  lockLabel: {fontSize: typography.sizes.sm, color: colors.text.secondary},
  dimRow: {flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md},
  dimField: {flex: 1},
  dimLabel: {fontSize: typography.sizes.xs, color: colors.text.muted, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5},
  dimInput: {
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: radius.md, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)', paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, color: colors.text.primary, textAlign: 'center',
  },
  dimX: {fontSize: typography.sizes.xl, color: colors.text.muted, marginBottom: spacing.xs},
  presetsLabel: {fontSize: typography.sizes.xs, color: colors.text.muted, letterSpacing: 1, textTransform: 'uppercase', marginTop: spacing.md, marginBottom: spacing.sm},
  presetsRow: {marginHorizontal: -spacing.xs},
  presetBtn: {
    marginHorizontal: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.md, backgroundColor: 'rgba(191,90,242,0.1)', borderWidth: 1, borderColor: 'rgba(191,90,242,0.25)', alignItems: 'center',
  },
  presetLabel: {fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.accent.purple},
  presetDim: {fontSize: typography.sizes.xs, color: colors.text.muted},
  errorBanner: {backgroundColor: colors.accent.redDim, borderRadius: radius.md, borderWidth: 1, borderColor: `${colors.accent.red}40`, padding: spacing.md, marginBottom: spacing.base},
  errorText: {fontSize: typography.sizes.sm, color: colors.accent.red},
  cta: {marginTop: spacing.xs},
});

export default ResizeScreen;
