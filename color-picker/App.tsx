import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import ColorPicker from "./components/ColorPicker";

const COLORS = [
  "red",
  "purple",
  "blue",
  "cyan",
  "green",
  "yellow",
  "orange",
  "black",
  "white",
];

const BACKGROUND_COLOR = "rgba(0,0,0,0.9)";

const { width } = Dimensions.get("window");

const CIRCLE_SIZE = width * 0.7;

const PICKER_WIDTH = width * 0.9;

export default function App() {
  const pickedColor = useSharedValue<string | number>(COLORS[0]);

  const onColorChanged = useCallback((color: string | number) => {
    "worklet";
    pickedColor.value = color;
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: pickedColor.value,
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={[styles.topContainer]}>
        <Animated.View style={[styles.circle, rStyle]}></Animated.View>
      </View>
      <View style={[styles.bottomContainer]}>
        <ColorPicker
          onColorChanged={onColorChanged}
          colors={COLORS}
          style={[styles.gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          maxWidth={PICKER_WIDTH}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 3,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    height: 50,
    width: PICKER_WIDTH,
    borderRadius: 40,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
});
