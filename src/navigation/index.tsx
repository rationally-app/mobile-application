import React, { ReactElement } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import StackNavigator from "./StackNavigator";
import { StatusBar, View, Platform } from "react-native";
import LoginScreen from "./LoginScreen";
import { Linking } from "expo";

const SwitchNavigator = createSwitchNavigator(
  {
    LoginScreen: { screen: LoginScreen, path: "action" },
    StackNavigator
  },
  { initialRouteName: "LoginScreen" }
);

const AppContainer = createAppContainer(SwitchNavigator);

const App = (): ReactElement => (
  <>
    <StatusBar />
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      }}
    >
      <AppContainer uriPrefix={Linking.makeUrl("/")} />
    </View>
  </>
);

export default App;
