import React from "react";
import { storiesOf } from "@storybook/react-native";
import { AppName } from "../../../src/components/Layout/AppName";
import { View, Text, StyleSheet } from "react-native";
import { size, color } from "../../../src/common/styles";
import { AppMode } from "../../../src/context/config";

const styles = StyleSheet.create({
  header: {
    fontSize: size(2),
    color: color("grey", 0),
    margin: size(1),
    textDecorationLine: "underline",
  },
  wrapper: {
    marginBottom: size(3),
    alignItems: "center",
  },
});

const appNameElements = (): JSX.Element[] => {
  return [
    <>
      <Text style={styles.header}>App name in production mode</Text>
      <AppName />
    </>,
    <>
      <Text style={styles.header}>App name in staging mode</Text>
      <AppName mode={AppMode.staging} />
    </>,
  ];
};

storiesOf("Layout", module).add("AppName", () => (
  <View style={{ margin: size(3), backgroundColor: color("blue", 60) }}>
    {appNameElements().map((appNameElement, index) => (
      <View key={index} style={styles.wrapper}>
        {appNameElement}
      </View>
    ))}
  </View>
));
