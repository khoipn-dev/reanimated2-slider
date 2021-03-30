import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {shadowStyle} from './style';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {clamp} from './utils';
import AnimatedText from './AnimatedText';

const SLIDER_WIDTH = 300;
const KNOB_WIDTH = 70;
const MAX_RANGE = 20;

const onDraggedSuccess = () => {
  Alert.alert('dragged');
};

const Slider1 = () => {
  const translateX = useSharedValue(0);
  const isSliding = useSharedValue(false);

  const gestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.offsetX = translateX.value;
    },
    onActive: (event, ctx) => {
      isSliding.value = true;
      translateX.value = clamp(
        event.translationX + ctx.offsetX,
        0,
        SLIDER_WIDTH - KNOB_WIDTH,
      );
    },
    onEnd: (event, ctx) => {
      isSliding.value = false;
      if (translateX.value > SLIDER_WIDTH - KNOB_WIDTH - 3) {
        runOnJS(onDraggedSuccess)();
      }
    },
  });

  const stepText = useDerivedValue(() => {
    const sliderRange = SLIDER_WIDTH - KNOB_WIDTH;
    const oneStepValue = sliderRange / MAX_RANGE;
    const step = Math.ceil(translateX.value / oneStepValue);
    return String(step);
  });

  const scrollTransitionStyles = useAnimatedStyle(() => {
    return {transform: [{translateX: translateX.value}]};
  });

  const progressStyles = useAnimatedStyle(() => {
    return {width: translateX.value + KNOB_WIDTH};
  });

  return (
    <View style={styles.slider}>
      <Animated.View style={[styles.progress, progressStyles]} />
      <PanGestureHandler onGestureEvent={gestureEvent}>
        <Animated.View style={[styles.knob, scrollTransitionStyles]}>
          <AnimatedText text={stepText} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Slider1;

const styles = StyleSheet.create({
  slider: {
    height: KNOB_WIDTH,
    width: SLIDER_WIDTH,
    borderRadius: KNOB_WIDTH / 2,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    ...shadowStyle,
  },
  progress: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#3f51b5',
    borderRadius: KNOB_WIDTH / 2,
  },
  knob: {
    height: KNOB_WIDTH,
    width: KNOB_WIDTH,
    borderRadius: KNOB_WIDTH / 2,
    backgroundColor: '#757de8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
