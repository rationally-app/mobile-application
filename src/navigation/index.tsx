import React, { ReactElement } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { DbContextProvider } from "../context/db";
import StackNavigator from "./StackNavigator";
import { StatusBar, View, Platform } from "react-native";
import InitialisationScreen from "./InitialisationScreen";
import { Linking } from "expo";
import { NetworkContextProvider } from "../context/network";

const SwitchNavigator = createSwitchNavigator(
  {
    InitialisationScreen: { screen: InitialisationScreen, path: "action" },
    StackNavigator
  },
  { initialRouteName: "InitialisationScreen" }
);

const AppContainer = createAppContainer(SwitchNavigator);

const App = (): ReactElement => (
  <DbContextProvider>
    <NetworkContextProvider>
      <StatusBar />
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
        }}
      >
        <AppContainer uriPrefix={Linking.makeUrl("/")} />
      </View>
    </NetworkContextProvider>
  </DbContextProvider>
);

export default App;
