import React, { ReactElement } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import StackNavigator from "./StackNavigator";
import { StatusBar, View, Platform } from "react-native";
import LoginScreen from "./LoginScreen";
import { AuthenticationContextProvider } from "../context/auth";
import { FontLoader } from "../components/FontLoader";

const SwitchNavigator = createSwitchNavigator(
  {
    LoginScreen: { screen: LoginScreen },
    StackNavigator
  },
  { initialRouteName: "LoginScreen" }
);

const AppContainer = createAppContainer(SwitchNavigator);

const App = (): ReactElement => {
  return (
    <AuthenticationContextProvider>
      <StatusBar />
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
        }}
      >
        <FontLoader>
          <AppContainer />
        </FontLoader>
      </View>
    </AuthenticationContextProvider>
  );
};

export default App;
