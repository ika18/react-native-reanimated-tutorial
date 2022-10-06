import { StyleSheet } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useDerivedValue,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";
import Page, { PAGE_WIDTH } from "./components/Page";

const titles = ["what's", "up", "mobile", "devs?"];

type ContextType = {
  x: number;
};

const MAX_TRANSLATE_X = -PAGE_WIDTH * (titles.length - 1);

export default function App() {
  const translateX = useSharedValue(0);
  const clampedTranslatedX = useDerivedValue(() => {
    return Math.max(Math.min(translateX.value, 0), MAX_TRANSLATE_X);
  });

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, context) => {
      context.x = clampedTranslatedX.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.x;
    },
    onEnd: (event) => {
      translateX.value = withDecay({ velocity: event.velocityX });
    },
  });
  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={{ flex: 1, flexDirection: "row" }}>
          {titles.map((title, index) => {
            return (
              <Page
                title={title}
                index={index}
                key={index.toString()}
                translateX={clampedTranslatedX}
              />
            );
          })}
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
