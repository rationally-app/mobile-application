import React, { ReactElement } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { DbContextProvider } from "../context/db";
import StackNavigator from "./StackNavigator";
import LoadingScreen from "./LoadingScreen";
import { StatusBar, View, Platform } from "react-native";

const SwitchNavigator = createSwitchNavigator(
  { LoadingScreen, StackNavigator },
  { initialRouteName: "LoadingScreen" }
);

const AppContainer = createAppContainer(SwitchNavigator);

const App = (): ReactElement => (
  <DbContextProvider>
    <StatusBar />
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      }}
    >
      <AppContainer />
    </View>
  </DbContextProvider>
);

export default App;
