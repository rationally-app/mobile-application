import React, { ReactElement, useEffect, useState } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import StackNavigator from "./StackNavigator";
import { StatusBar, View, Platform } from "react-native";
import LoginScreen from "./LoginScreen";
import { Linking } from "expo";
import { AuthenticationContextProvider } from "../context/auth";
import * as Font from "expo-font";
import { LoadingView } from "../components/Loading";

const SwitchNavigator = createSwitchNavigator(
  {
    LoginScreen: { screen: LoginScreen, path: "action" },
    StackNavigator
  },
  { initialRouteName: "LoginScreen" }
);

const AppContainer = createAppContainer(SwitchNavigator);

const App = (): ReactElement => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    const loadFonts = async (): Promise<void> => {
      await Font.loadAsync({
        inter: require("../../assets/fonts/Inter-Regular.otf"),
        "inter-bold": require("../../assets/fonts/Inter-Bold.otf")
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  return (
    <AuthenticationContextProvider>
      <StatusBar />
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
        }}
      >
        {fontsLoaded ? (
          <AppContainer uriPrefix={Linking.makeUrl("/")} />
        ) : (
          <LoadingView />
        )}
      </View>
    </AuthenticationContextProvider>
  );
};

export default App;
