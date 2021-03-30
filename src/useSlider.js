import {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  runOnJS,
  interpolate,
  Extrapolate,
  interpolateColor,
} from 'react-native-reanimated';
import {clamp} from './utils';

const useSlider = (
  sliderWidth,
  knobWidth,
  onDraggedSuccess,
  maxRange = 10,
  initialValue = 0,
) => {
  const SLIDE_RANGE = sliderWidth - knobWidth;
  const STEP = SLIDE_RANGE / maxRange ?? 1;
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
        sliderWidth - knobWidth,
      );
    },
    onEnd: (event, ctx) => {
      isSliding.value = false;
      if (translateX.value > sliderWidth - knobWidth - 3) {
        runOnJS(onDraggedSuccess)();
      }
    },
  });

  const stepText = useDerivedValue(() => {
    const step = Math.ceil(translateX.value / STEP);
    return String(step);
  });

  const scrollTransitionStyles = useAnimatedStyle(() => {
    return {transform: [{translateX: translateX.value}]};
  });

  const progressStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [0, SLIDE_RANGE],
      ['rgb(129,212,250)', 'rgb(3,169,244)'],
    );
    return {width: translateX.value + knobWidth, backgroundColor};
  });

  const rotateStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(
            translateX.value,
            [0, SLIDE_RANGE],
            [0, 4 * 360],
            Extrapolate.CLAMP,
          )}deg`,
        },
      ],
    };
  });

  return {
    gestureEvent,
    values: {
      isSliding,
      translateX,
      stepText,
    },
    styles: {
      progressStyles,
      scrollTransitionStyles,
      rotateStyles,
    },
  };
};

export default useSlider;
