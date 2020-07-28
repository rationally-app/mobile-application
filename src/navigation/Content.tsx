import React, { ReactElement, useRef, useEffect } from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationContainerComponent
} from "react-navigation";
import CustomerQuotaStack from "./CustomerQuotaStack";
import MerchantPayoutStack from "./MerchantPayoutStack";
import { StatusBar, View, Platform } from "react-native";
import LoginScreen from "./LoginScreen";
import { useAppState } from "../hooks/useAppState";
import { useCheckUpdates } from "../hooks/useCheckUpdates";
import { useValidateExpiry } from "../hooks/useValidateExpiry";
import * as Linking from "expo-linking";
import { createDrawerNavigator } from "react-navigation-drawer";
import { DrawerNavigationComponent } from "../components/Layout/DrawerNavigation";
import { StackViewTransitionConfigs } from "react-navigation-stack";
import { DisputeReasonScreen } from "../components/Dispute/DisputeReasonScreen";

const SwitchNavigator = createSwitchNavigator(
  {
    DisputeReasonScreen: { screen: DisputeReasonScreen, path: "dispute" },
    LoginScreen: { screen: LoginScreen, path: "login" },
    DrawerNavigator: createDrawerNavigator(
      {
        CustomerQuotaStack: {
          screen: CustomerQuotaStack
        },
        MerchantPayoutStack: {
          screen: MerchantPayoutStack
        }
      },
      {
        drawerPosition: "right",
        drawerType: "slide",
        contentComponent: DrawerNavigationComponent,
        navigationOptions: {
          transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
          navigationOptions: {
            gesturesEnabled: true
          }
        }
      }
    )
  },
  // { initialRouteName: "LoginScreen" }
  { initialRouteName: "DisputeReasonScreen" }
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
          paddingTop:
            Platform.OS === "android" && !__DEV__ ? StatusBar.currentHeight : 0 // padding is used to prevent content from going behind the status bar on Android production builds
        }}
      >
        <AppContainer ref={navigatorRef} uriPrefix={prefix} />
      </View>
    </>
  );
};
