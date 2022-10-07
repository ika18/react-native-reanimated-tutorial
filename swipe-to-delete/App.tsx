import { StatusBar } from "expo-status-bar";
import { useCallback, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import ListItem from "./components/ListItem";

const TITLES = [
  "Record the dismissable tutorial",
  "Leave 👍 to the video",
  "Check YouTube comments",
  "Subscribe to the channel 🚀",
  "Leave a ⭐ on the GitHub Repo",
];

export interface TaskInterface {
  title: string;
  index: number;
}

const TASKS = TITLES.map((title, index) => ({ title, index }));

const BACKGROUND_COLOR = "#FAFBFF";

export default function App() {
  const [tasks, setTasks] = useState(TASKS);

  const onDismiss = useCallback((task: TaskInterface) => {
    setTasks((tasks) => tasks.filter((item) => item.index !== task.index));
  }, []);

  const scrollRef = useRef(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Tasks</Text>
        <ScrollView style={{ flex: 1 }} ref={scrollRef}>
          {tasks.map((task, index) => {
            return (
              <ListItem
                key={task.index}
                task={task}
                onDismiss={onDismiss}
                simultaneousHandlers={scrollRef}
              />
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  title: {
    fontSize: 60,
    marginVertical: 20,
    paddingLeft: "5%",
  },
});
