import React from 'react';
import {TextInput} from 'react-native';
import Animated, {useAnimatedProps} from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const AnimatedText = ({text}) => {
  const animatedProps = useAnimatedProps(() => {
    return {
      text: text.value,
    };
  });
  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={text.value}
      animatedProps={animatedProps}
    />
  );
};
export default AnimatedText;
