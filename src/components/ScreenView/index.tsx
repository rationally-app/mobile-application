import React, { FunctionComponent } from "react";
import { SafeAreaView, StatusBar } from "react-native";

export const ScreenView: FunctionComponent = ({ children }) => (
  <SafeAreaView style={{ flex: 1 }}>
    <StatusBar hidden={true} />
    {children}
  </SafeAreaView>
);
