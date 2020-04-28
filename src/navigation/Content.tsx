import React, { ReactElement, useRef, useEffect } from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationContainerComponent
} from "react-navigation";
import StackNavigator from "./StackNavigator";
import { StatusBar, View, Platform } from "react-native";
import LoginScreen from "./LoginScreen";
import { useAppState } from "../hooks/useAppState";
import { useCheckUpdates } from "../hooks/useCheckUpdates";
import { useValidateExpiry } from "../hooks/useValidateExpiry";
import { Linking } from "expo";
import { AppText } from "../components/Layout/AppText";

const SwitchNavigator = createSwitchNavigator(
  {
    LoginScreen: { screen: LoginScreen, path: "login" },
    StackNavigator
  },
  { initialRouteName: "LoginScreen" }
);

const AppContainer = createAppContainer(SwitchNavigator);

export const Content = (): ReactElement => {
  const navigatorRef = useRef<NavigationContainerComponent>(null);
  const appState = useAppState();
  const prefix = Linking.makeUrl("/");

  const checkUpdates = useCheckUpdates();
  useEffect(() => {
    if (appState === "active") {
      checkUpdates();
    }
  }, [appState, checkUpdates]);

  const validateTokenExpiry = useValidateExpiry(navigatorRef.current?.dispatch);
  useEffect(() => {
    if (appState === "active") {
      validateTokenExpiry();
    }
  }, [appState, validateTokenExpiry]);

  return (
    <>
      <StatusBar />
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
        }}
      >
        <AppContainer ref={navigatorRef} uriPrefix={prefix} />
        <AppText style={{ position: "absolute", bottom: 120 }}>
          {prefix}
        </AppText>
        <AppText style={{ position: "absolute", bottom: 80 }}>
          {Linking.makeUrl("/", { key: "key", endpoint: "endpoint" })}
        </AppText>
      </View>
    </>
  );
};
