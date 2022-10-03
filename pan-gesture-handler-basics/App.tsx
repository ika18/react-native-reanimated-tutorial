import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SIZE = 100.0;
const CIRCLE_RADIUS = 100.0 * 2;

type IContext = {
  translateX: number;
  translateY: number;
};

export default function App() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    IContext
  >({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.translateX + event.translationX;
      translateY.value = context.translateY + event.translationY;
    },
    onEnd: (event) => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);
      if (distance < CIRCLE_RADIUS + SIZE / 2) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={[styles.square, rStyle]} />
        </PanGestureHandler>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: "rgba(0, 0, 256, 0.5)",
    borderRadius: 20,
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: CIRCLE_RADIUS,
    borderWidth: 5,
    borderColor: "rgba(0, 0, 256, 0.5)",
  },
});
