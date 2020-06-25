import React, { ReactElement, useRef, useEffect } from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationContainerComponent
} from "react-navigation";
import CustomerQuotaStack from "./CustomerQuotaStack";
import MerchantPayoutStack from "./MerchantPayoutStack";
import { StatusBar, View } from "react-native";
import LoginScreen from "./LoginScreen";
import { useAppState } from "../hooks/useAppState";
import { useCheckUpdates } from "../hooks/useCheckUpdates";
import { useValidateExpiry } from "../hooks/useValidateExpiry";
import { Linking } from "expo";

const SwitchNavigator = createSwitchNavigator(
  {
    LoginScreen: { screen: LoginScreen, path: "login" },
    CustomerQuotaStack,
    MerchantPayoutStack
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
          flex: 1
        }}
      >
        <AppContainer ref={navigatorRef} uriPrefix={prefix} />
      </View>
    </>
  );
};
