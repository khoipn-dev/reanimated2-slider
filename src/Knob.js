import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';

const Knob = ({isSliding, rotateStyles}) => {
  const knobUpStyles = useAnimatedStyle(() => {
    return {opacity: isSliding.value ? 0 : 1};
  });
  const knobDownStyles = useAnimatedStyle(() => {
    return {opacity: isSliding.value ? 1 : 0};
  });
  return (
    <Animated.View style={[styles.container, rotateStyles]}>
      <Animated.Image
        source={require('./assets/up.png')}
        style={[styles.image, knobUpStyles]}
      />
      <Animated.Image
        source={require('./assets/down.png')}
        style={[styles.image, knobDownStyles]}
      />
    </Animated.View>
  );
};

export default Knob;

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
});
