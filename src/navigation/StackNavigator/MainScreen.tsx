import React, { FunctionComponent } from "react";
import { Text, View } from "react-native";
import { NavigationProps } from "../types";

const MainScreen: FunctionComponent<NavigationProps> = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Main Screen</Text>
    </View>
  );
};

export default MainScreen;
