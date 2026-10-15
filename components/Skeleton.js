import { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

// Wrap any group of SkeletonBlocks in this and they all pulse together.
export function SkeletonPulse({ children, style, ...rest }) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View style={[style, { opacity }]} {...rest}>
      {children}
    </Animated.View>
  );
}

// A grey rectangle standing in for an image or a line of text.
export function SkeletonBlock({ style }) {
  return <View style={[styles.block, style]} />;
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.border,
    borderRadius: radius.sm,
  },
});