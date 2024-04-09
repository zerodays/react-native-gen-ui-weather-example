import React from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

interface AnimateInProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimateIn = ({ children, delay = 0 }: AnimateInProps) => {
  // Shared values for the opacity and translationY properties
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  // Animated styles
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  React.useEffect(() => {
    // Animating opacity and translateY with a delay
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) })
    );
  }, [delay]);

  return <Animated.View style={animatedStyles}>{children}</Animated.View>;
};

export default AnimateIn;
