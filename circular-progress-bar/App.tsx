import { useCallback } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import Svg, { Circle, CircleProps } from "react-native-svg";

const BACKGROUND_COLOR = "#444B6F";
const BACKGROUND_STROKE_COLOR = "#303858";
const STROKE_COLOR = "#A6E1FA";

const { width, height } = Dimensions.get("window");

const CIRCLE_LENGTH = 1000; // 2PI * R
const R = CIRCLE_LENGTH / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function App() {
  const progress = useSharedValue(0);
  const progressText = useDerivedValue(() => {
    return `${Math.floor(progress.value * 100)}`;
  });

  const animatedProps = useAnimatedProps<CircleProps>(() => {
    return {
      strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
    };
  });

  const onPress = useCallback(() => {
    progress.value = withTiming(progress.value > 0 ? 0 : 1, {
      duration: 2000,
    });
  }, []);

  return (
    <View style={styles.container}>
      <ReText style={[styles.progressText]} text={progressText}></ReText>
      <Svg style={[{ position: "absolute" }]}>
        <Circle
          cx={width / 2}
          cy={height / 2}
          r={R}
          stroke={BACKGROUND_STROKE_COLOR}
          strokeWidth={30}
        />
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={R}
          stroke={STROKE_COLOR}
          strokeWidth={15}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedProps}
          strokeLinecap={"round"}
        />
      </Svg>
      <TouchableOpacity style={[styles.button]} onPress={onPress}>
        <Text style={[styles.buttonText]}>Run</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    fontSize: 80,
    color: "rgba(256,256,256, 0.7)",
    width: 200,
    textAlign: "center",
  },
  button: {
    position: "absolute",
    borderRadius: 25,
    bottom: 80,
    width: width * 0.7,
    height: 60,
    backgroundColor: BACKGROUND_STROKE_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 25,
    color: "white",
    letterSpacing: 2,
  },
});
