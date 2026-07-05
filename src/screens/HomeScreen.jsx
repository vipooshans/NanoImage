import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, typography, spacing, radius} from '../theme/theme';
import Icon from 'react-native-vector-icons/Feather';

const {width} = Dimensions.get('window');

const FEATURES = [
  {
    id: 'compress', icon: 'minimize', title: 'Compress', subtitle: 'Reduce file size',
    gradient: ['#00F5FF', '#0080FF'], screen: 'Compress', glow: colors.accent.cyan,
  },
  {
    id: 'resize', icon: 'crop', title: 'Resize', subtitle: 'Custom dimensions',
    gradient: ['#BF5AF2', '#6E40C9'], screen: 'Resize', glow: colors.accent.purple,
  },
  {
    id: 'convert', icon: 'refresh-cw', title: 'Convert', subtitle: 'JPEG · PNG · WebP',
    gradient: ['#30D158', '#25A244'], screen: 'Convert', glow: colors.accent.green,
  },
  {
    id: 'batch', icon: 'layers', title: 'Batch', subtitle: 'Process multiple',
    gradient: ['#FF9F0A', '#FF6B00'], screen: 'Batch', glow: colors.accent.orange,
  },
];

const FeatureCard = ({feature, onPress}) => {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={{transform: [{scale}], width: CARD_SIZE, margin: spacing.sm}}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, {toValue: 0.96, useNativeDriver: true, speed: 20}).start()}
        onPressOut={() => Animated.spring(scale, {toValue: 1, useNativeDriver: true, speed: 20}).start()}
        activeOpacity={1}
        style={[styles.featureCard, {shadowColor: feature.glow}]}>
        <LinearGradient
          colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
          style={styles.cardGradient}>
          <LinearGradient colors={feature.gradient} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.accentLine} />
          <View style={styles.cardContent}>
            <View style={[styles.iconCircle, {backgroundColor: `${feature.glow}1A`, borderColor: `${feature.glow}30`}]}>
              <Icon name={feature.icon} size={22} color={feature.glow} />
            </View>
            <Text style={styles.cardTitle}>{feature.title}</Text>
            <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
          </View>
          <View style={styles.arrow}>
            <Icon name="chevron-right" size={20} color={feature.glow} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const HomeScreen = ({navigation}) => {
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(20)).current;
  const gridOpacity = useRef(new Animated.Value(0)).current;
  const gridTranslate = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(heroOpacity, {toValue: 1, duration: 500, useNativeDriver: true}),
        Animated.spring(heroTranslate, {toValue: 0, tension: 50, friction: 7, useNativeDriver: true})
      ]),
      Animated.parallel([
        Animated.timing(gridOpacity, {toValue: 1, duration: 500, useNativeDriver: true}),
        Animated.spring(gridTranslate, {toValue: 0, tension: 50, friction: 7, useNativeDriver: true})
      ])
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {toValue: 1.2, duration: 1000, useNativeDriver: true}),
        Animated.timing(pulseAnim, {toValue: 1, duration: 1000, useNativeDriver: true})
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg.primary} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <Animated.View style={{opacity: heroOpacity, transform: [{translateY: heroTranslate}]}}>
          <LinearGradient colors={['#0D1525', colors.bg.primary]} style={styles.hero}>
            <View style={[styles.logoRow, {justifyContent: 'center'}]}>
              <Image source={require('../../logo.png')} style={styles.fullLogoImage} resizeMode="contain" />
            </View>
            <View style={styles.statRow}>
              {['JPEG', 'PNG', 'WebP'].map((s, i) => (
                <View key={i} style={styles.statPill}>
                  <Text style={styles.statVal}>{s}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.heroSubtext}>Compress · Resize · Convert · Batch Process</Text>
          </LinearGradient>
        </Animated.View>

        {/* Feature Grid & Info Banner */}
        <Animated.View style={{opacity: gridOpacity, transform: [{translateY: gridTranslate}]}}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TOOLS</Text>
            <View style={styles.grid}>
              {FEATURES.map((feature, index) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  onPress={() => navigation.navigate(feature.screen)}
                />
              ))}
            </View>
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <LinearGradient
              colors={['rgba(0,245,255,0.05)', 'rgba(191,90,242,0.05)']}
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
              style={styles.infoGradient}>
              <Animated.View style={{transform: [{scale: pulseAnim}]}}>
                <Icon name="info" size={20} color={colors.accent.cyan} style={styles.infoIcon} />
              </Animated.View>
              <Text style={styles.infoText}>
                Tip: Use{' '}
                <Text style={{color: colors.accent.orange, fontWeight: '600'}}>Batch Compress</Text>
                {' '}to process multiple images at once with progress tracking.
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>
        <View style={{height: spacing.xxxl}} />
      </ScrollView>
    </View>
  );
};

const CARD_SIZE = (width - spacing.base * 2 - spacing.sm * 4) / 2;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg.primary},
  scroll: {flexGrow: 1},
  hero: {
    paddingTop: spacing.xl + 16, paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.base, alignItems: 'center',
  },
  logoRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg},
  fullLogoImage: {width: 280, height: 80},
  statRow: {flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md},
  statPill: {
    paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  statVal: {fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, color: colors.text.secondary, letterSpacing: 0.5},
  heroSubtext: {fontSize: typography.sizes.sm, color: colors.text.muted, letterSpacing: 1, textTransform: 'uppercase'},
  section: {paddingHorizontal: spacing.base, paddingTop: spacing.lg},
  sectionTitle: {fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, color: colors.text.muted, letterSpacing: 2, marginBottom: spacing.sm, marginLeft: spacing.sm},
  grid: {flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.sm},
  featureCard: {
    borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6, minHeight: CARD_SIZE * 0.9,
  },
  cardGradient: {flex: 1, minHeight: CARD_SIZE * 0.9, position: 'relative'},
  accentLine: {height: 2, width: '100%'},
  cardContent: {padding: spacing.base, flex: 1},
  iconCircle: {width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginBottom: spacing.md},
  icon: {fontSize: 22},
  cardTitle: {fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text.primary, marginBottom: 4},
  cardSubtitle: {fontSize: typography.sizes.sm, color: colors.text.secondary, lineHeight: 18},
  arrow: {position: 'absolute', right: spacing.md, bottom: spacing.md},
  arrowText: {fontSize: 22, fontWeight: typography.weights.light},
  infoBanner: {
    marginHorizontal: spacing.base, marginTop: spacing.xl, borderRadius: radius.lg,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,245,255,0.15)',
  },
  infoGradient: {flexDirection: 'row', alignItems: 'center', padding: spacing.base, gap: spacing.sm},
  infoIcon: {fontSize: 18},
  infoText: {flex: 1, fontSize: typography.sizes.sm, color: colors.text.secondary, lineHeight: 20},
});

export default HomeScreen;
