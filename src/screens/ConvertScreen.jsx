import React, {useState, useCallback} from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {colors, typography, spacing, radius} from '../theme/theme';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import ImagePreview from '../components/ImagePreview';
import ProgressBar from '../components/ProgressBar';
import {convertImage, FORMAT_LABELS} from '../services/convertService';
import {getFileSize, getExtension} from '../services/fileService';
import {requestStoragePermissions} from '../utils/permissionsHelper';

const FORMATS = ['jpeg', 'png', 'webp'];

const FORMAT_INFO = {
  jpeg: {icon: '🎨', desc: 'Best for photos. Lossy compression, smaller files.', color: colors.accent.orange},
  png: {icon: '🔷', desc: 'Lossless quality. Ideal for graphics and transparency.', color: colors.accent.cyan},
  webp: {icon: '⚡', desc: 'Modern format. Smaller than JPEG/PNG at same quality.', color: colors.accent.green},
};

const ConvertScreen = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [sourceFormat, setSourceFormat] = useState('jpeg');
  const [targetFormat, setTargetFormat] = useState('webp');
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
      const ext = getExtension(asset.uri) || getExtension(asset.fileName) || 'jpeg';
      const normalizedExt = ext === 'jpg' ? 'jpeg' : ext;
      setImage({uri: asset.uri, name: asset.fileName, size});
      setSourceFormat(normalizedExt);
      const defaults = {jpeg: 'webp', png: 'webp', webp: 'jpeg'};
      setTargetFormat(defaults[normalizedExt] || 'webp');
    }
  }, []);

  const handleConvert = useCallback(async () => {
    if (!image) return;
    if (sourceFormat === targetFormat) { setError('Source and target formats are the same.'); return; }
    setLoading(true); setProgress(0.2); setError(null);
    try {
      setProgress(0.5);
      const result = await convertImage(image.uri, targetFormat);
      setProgress(1);
      setTimeout(() => {
        navigation.navigate('Result', {
          originalUri: image.uri, outputUri: result.outputUri,
          originalSize: result.originalSize, processedSize: result.convertedSize,
          operation: 'Convert', fromFormat: sourceFormat, toFormat: result.format,
        });
        setLoading(false); setProgress(0);
      }, 400);
    } catch (err) {
      setError(err.message || 'Conversion failed.'); setLoading(false); setProgress(0);
    }
  }, [image, sourceFormat, targetFormat, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg.primary} />
      <Header title="Convert Format" subtitle="JPEG · PNG · WebP" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard accent="green" style={styles.card}>
          <Text style={styles.cardTitle}>Select Image</Text>
          <TouchableOpacity onPress={pickImage} style={styles.pickArea}>
            {image ? (
              <ImagePreview
                uri={image.uri}
                label={`Source: ${FORMAT_LABELS[sourceFormat] || sourceFormat.toUpperCase()}`}
                fileSize={image.size} accent="green" style={styles.preview}
              />
            ) : (
              <View style={styles.emptyPick}>
                <Text style={styles.pickIcon}>⇄</Text>
                <Text style={[styles.pickText, {color: colors.accent.green}]}>Tap to select image</Text>
                <Text style={styles.pickSub}>Any image format</Text>
              </View>
            )}
          </TouchableOpacity>
          {image && (
            <TouchableOpacity onPress={pickImage} style={styles.changeBtn}>
              <Text style={[styles.changeBtnText, {color: colors.accent.green}]}>Change Image</Text>
            </TouchableOpacity>
          )}
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Conversion Path</Text>
          <View style={styles.formatFlow}>
            <View style={styles.formatBox}>
              <Text style={styles.formatBoxLabel}>FROM</Text>
              <View style={[styles.formatBadge, {borderColor: `${FORMAT_INFO[sourceFormat]?.color || colors.accent.cyan}50`, backgroundColor: `${FORMAT_INFO[sourceFormat]?.color || colors.accent.cyan}15`}]}>
                <Text style={styles.formatBadgeIcon}>{FORMAT_INFO[sourceFormat]?.icon}</Text>
                <Text style={[styles.formatBadgeText, {color: FORMAT_INFO[sourceFormat]?.color}]}>
                  {FORMAT_LABELS[sourceFormat] || sourceFormat.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={styles.formatBox}>
              <Text style={styles.formatBoxLabel}>TO</Text>
              <View style={styles.targetSelector}>
                {FORMATS.filter(f => f !== sourceFormat).map(fmt => (
                  <TouchableOpacity
                    key={fmt}
                    onPress={() => setTargetFormat(fmt)}
                    style={[
                      styles.formatOption,
                      targetFormat === fmt && {backgroundColor: `${FORMAT_INFO[fmt].color}20`, borderColor: FORMAT_INFO[fmt].color},
                    ]}>
                    <Text style={styles.formatOptionIcon}>{FORMAT_INFO[fmt].icon}</Text>
                    <Text style={[styles.formatOptionText, targetFormat === fmt && {color: FORMAT_INFO[fmt].color}]}>
                      {FORMAT_LABELS[fmt]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          {targetFormat && FORMAT_INFO[targetFormat] && (
            <View style={[styles.formatDesc, {backgroundColor: `${FORMAT_INFO[targetFormat].color}10`, borderColor: `${FORMAT_INFO[targetFormat].color}25`}]}>
              <Text style={[styles.formatDescText, {color: FORMAT_INFO[targetFormat].color}]}>
                {FORMAT_INFO[targetFormat].desc}
              </Text>
            </View>
          )}
        </GlassCard>

        {loading && <GlassCard style={styles.card}><ProgressBar progress={progress} color="green" label="Converting..." /></GlassCard>}
        {error && <View style={styles.errorBanner}><Text style={styles.errorText}>⚠️ {error}</Text></View>}

        <ActionButton label="Convert Now" icon="⇄" onPress={handleConvert} loading={loading} disabled={!image} variant="green" style={styles.cta} />
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
    height: 180, backgroundColor: 'rgba(48,209,88,0.04)', borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(48,209,88,0.2)', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
  },
  pickIcon: {fontSize: 36},
  pickText: {fontSize: typography.sizes.base, fontWeight: typography.weights.medium},
  pickSub: {fontSize: typography.sizes.sm, color: colors.text.muted},
  preview: {height: 200},
  changeBtn: {marginTop: spacing.sm, alignItems: 'center', paddingVertical: spacing.xs},
  changeBtnText: {fontSize: typography.sizes.sm, fontWeight: typography.weights.medium},
  formatFlow: {flexDirection: 'row', alignItems: 'center', gap: spacing.base, marginBottom: spacing.md},
  formatBox: {flex: 1, alignItems: 'center'},
  formatBoxLabel: {fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, color: colors.text.muted, letterSpacing: 1, marginBottom: spacing.sm},
  formatBadge: {paddingHorizontal: spacing.base, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', minWidth: 80},
  formatBadgeIcon: {fontSize: 22, marginBottom: 4},
  formatBadgeText: {fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, letterSpacing: 0.5},
  flowArrow: {fontSize: typography.sizes.xl, color: colors.text.muted},
  targetSelector: {gap: spacing.xs, minWidth: 120},
  formatOption: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2, borderRadius: radius.md, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)',
  },
  formatOptionIcon: {fontSize: 16},
  formatOptionText: {fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text.secondary},
  formatDesc: {borderRadius: radius.md, borderWidth: 1, padding: spacing.sm, marginTop: spacing.xs},
  formatDescText: {fontSize: typography.sizes.sm, lineHeight: 18},
  errorBanner: {backgroundColor: colors.accent.redDim, borderRadius: radius.md, borderWidth: 1, borderColor: `${colors.accent.red}40`, padding: spacing.md, marginBottom: spacing.base},
  errorText: {fontSize: typography.sizes.sm, color: colors.accent.red},
  cta: {marginTop: spacing.xs},
});

export default ConvertScreen;
