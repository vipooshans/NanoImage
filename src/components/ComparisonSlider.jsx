import React from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import {PanGestureHandler, GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {colors, radius, spacing} from '../theme/theme';

const {width} = Dimensions.get('window');
const SLIDER_WIDTH = width - spacing.base * 2 - spacing.base * 2; // Accounting for card padding
const SLIDER_HEIGHT = 250;

/**
 * ComparisonSlider — Interactive Before/After image comparison
 */
const ComparisonSlider = ({beforeUri, afterUri}) => {
  const sliderPosition = useSharedValue(SLIDER_WIDTH / 2);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = sliderPosition.value;
    },
    onActive: (event, ctx) => {
      let nextPos = ctx.startX + event.translationX;
      nextPos = Math.max(0, Math.min(SLIDER_WIDTH, nextPos));
      sliderPosition.value = nextPos;
    },
  });

  const animatedAfterStyle = useAnimatedStyle(() => {
    return {
      width: sliderPosition.value,
    };
  });

  const animatedHandleStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: sliderPosition.value}],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Before Image (Background) */}
        {beforeUri && (
          <Image source={{uri: beforeUri}} style={styles.image} resizeMode="cover" />
        )}

        {/* After Image (Foreground, clipped) */}
        <Animated.View style={[styles.afterWrapper, animatedAfterStyle]}>
          {afterUri && (
            <Image
              source={{uri: afterUri}}
              style={[styles.image, {width: SLIDER_WIDTH}]}
              resizeMode="cover"
            />
          )}
        </Animated.View>

        {/* Drag Handle */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.handle, animatedHandleStyle]}>
            <View style={styles.handleLine} />
            <View style={styles.handleKnob}>
              <View style={styles.knobArrowLeft} />
              <View style={styles.knobArrowRight} />
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  imageContainer: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  afterWrapper: {
    height: '100%',
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    top: 0,
    borderRightWidth: 2,
    borderColor: colors.accent.cyan,
  },
  handle: {
    position: 'absolute',
    height: '100%',
    width: 40,
    marginLeft: -20, // Center the handle over the line
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  handleLine: {
    width: 2,
    height: '100%',
    backgroundColor: colors.accent.cyan,
    position: 'absolute',
  },
  handleKnob: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent.cyan,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent.cyan,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  knobArrowLeft: {
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderRightWidth: 5,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#080C14',
    marginRight: 2,
  },
  knobArrowRight: {
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 5,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#080C14',
    marginLeft: 2,
  },
});

export default ComparisonSlider;
