import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useCallback } from "react";

interface ColorPickerProps extends LinearGradientProps {
  maxWidth: number;
  onColorChanged?: (color: string | number) => void;
}

type ContextType = {
  x: number;
};

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  style,
  start,
  end,
  maxWidth,
  onColorChanged,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const onEnd = useCallback(() => {
    "worklet";
    translateY.value = withSpring(0);
    scale.value = withSpring(1);
  }, []);

  const adjustTranslateX = useDerivedValue(() => {
    return Math.min(
      Math.max(translateX.value, 0),
      maxWidth - CIRCLE_PICKER_SIZE
    );
  });

  const penGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, context) => {
      context.x = adjustTranslateX.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.x;
    },
    onEnd,
  });

  const tapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: (event) => {
        translateX.value = withTiming(event.absoluteX - CIRCLE_PICKER_SIZE);
        translateY.value = withSpring(-CIRCLE_PICKER_SIZE);
        scale.value = withSpring(1.2);
      },
      onEnd,
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: adjustTranslateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const rInnerPickerStyle = useAnimatedStyle(() => {
    const inputRange = colors.map(
      (_, index) => (index / colors.length) * maxWidth
    );
    const backgroundColor = interpolateColor(
      translateX.value,
      inputRange,
      colors
    );

    onColorChanged?.(backgroundColor);

    return {
      backgroundColor: backgroundColor,
    };
  });

  return (
    <TapGestureHandler onGestureEvent={tapGestureEvent}>
      <Animated.View>
        <PanGestureHandler onGestureEvent={penGestureEvent}>
          <Animated.View style={[{ justifyContent: "center" }]}>
            <LinearGradient
              colors={colors}
              style={[style]}
              start={start}
              end={end}
            />
            <Animated.View style={[styles.picker, rStyle]}>
              <Animated.View style={[styles.innerPicker, rInnerPickerStyle]} />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
};

export default ColorPicker;

const CIRCLE_PICKER_SIZE = 45;
const INNER_PICKER_SIZE = CIRCLE_PICKER_SIZE / 2;

const styles = StyleSheet.create({
  picker: {
    position: "absolute",
    backgroundColor: "#FFF",
    width: CIRCLE_PICKER_SIZE,
    height: CIRCLE_PICKER_SIZE,
    borderRadius: CIRCLE_PICKER_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  innerPicker: {
    width: INNER_PICKER_SIZE,
    height: INNER_PICKER_SIZE,
    borderRadius: INNER_PICKER_SIZE / 2,
    borderWidth: 1.0,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
});
