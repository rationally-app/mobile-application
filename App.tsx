import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Storybook from "./storybook";
import { IS_STORYBOOK_VIEW } from "./src/config";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

const App = (): React.ReactNode => (
  <View style={styles.container}>
    <Text>Open up App.tsx to start working on your app!</Text>
  </View>
);

export default IS_STORYBOOK_VIEW ? Storybook : App;
