import React, { ReactElement } from "react";
import { View, ViewStyle } from "react-native";

const styles = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: 20
} as ViewStyle;

export const CenterDecorator = (storyFn: Function): ReactElement => (
  <View style={styles}>{storyFn()}</View>
);
