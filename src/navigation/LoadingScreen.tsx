import React, { useEffect, FunctionComponent } from "react";
import { Text, View } from "react-native";
import { NavigationProps } from "./types";

const LoadingScreen: FunctionComponent<NavigationProps> = ({
  navigation
}: NavigationProps) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("StackNavigator");
    }, 1000);
  });
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Loading...</Text>
    </View>
  );
};

export default LoadingScreen;
