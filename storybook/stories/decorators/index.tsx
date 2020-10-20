import React, { ReactElement, ReactNode } from "react";
import { View, ViewStyle, SafeAreaView } from "react-native";

const styles = {
  flex: 1,
  justifyContent: "center",
} as ViewStyle;

export const CenterDecorator = (storyFn: () => ReactNode): ReactElement => (
  <View style={{ ...styles, alignItems: "center" }}>{storyFn()}</View>
);

export const CenterVerticalDecorator = (
  storyFn: () => ReactNode
): ReactElement => <View style={styles}>{storyFn()}</View>;

export const SafeAreaDecorator = (storyFn: () => ReactNode): ReactElement => (
  <SafeAreaView style={{ flex: 1 }}>{storyFn()}</SafeAreaView>
);
