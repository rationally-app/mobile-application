import React from "react";
import Storybook from "./storybook";
import { IS_STORYBOOK_VIEW } from "./src/config";
import { StyleSheet, Text, View } from "react-native";

const App = () => {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default IS_STORYBOOK_VIEW ? Storybook : App;
