import { StatusBar } from "expo-status-bar";
import { useCallback, useRef } from "react";
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  ImageBackground,
  Text,
} from "react-native";
import {
  TapGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function App() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const doubleTapRef = useRef();

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: Math.max(0, scale.value) }],
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const onDoubleTap = useCallback(() => {
    scale.value = withSpring(1, undefined, (isFinished) => {
      if (isFinished) {
        scale.value = withDelay(500, withSpring(0));
      }
    });
  }, []);

  const onSingleTap = useCallback(() => {
    opacity.value = withTiming(0, undefined, (isFinished) => {
      if (isFinished) {
        opacity.value = withDelay(0, withTiming(1));
      }
    });
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <TapGestureHandler waitFor={doubleTapRef} onActivated={onSingleTap}>
        <TapGestureHandler
          maxDelayMs={250}
          ref={doubleTapRef}
          numberOfTaps={2}
          onActivated={onDoubleTap}
        >
          <Animated.View>
            <ImageBackground
              source={require("./assets/image.jpeg")}
              style={[styles.image]}
            >
              <AnimatedImage
                source={require("./assets/heart.png")}
                style={[
                  styles.image,
                  {
                    shadowOffset: {
                      width: 0,
                      height: 20,
                    },
                    shadowOpacity: 0.35,
                    shadowRadius: 35,
                  },
                  rStyle,
                ]}
                resizeMode="center"
              />
            </ImageBackground>
            <AnimatedText style={[styles.turtles, rTextStyle]}>
              🐢🐢🐢🐢
            </AnimatedText>
          </Animated.View>
        </TapGestureHandler>
      </TapGestureHandler>
    </GestureHandlerRootView>
  );
}

const { width: SIZE } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: SIZE,
    height: SIZE,
  },
  turtles: {
    fontSize: 40,
    textAlign: "center",
    marginTop: 30,
  },
});
