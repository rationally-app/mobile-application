import React, { ReactElement, useRef, useEffect, useState } from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationContainerComponent,
} from "react-navigation";
import CustomerQuotaStack from "./CustomerQuotaStack";
import MerchantPayoutStack from "./MerchantPayoutStack";
import { StatusBar, View, Platform } from "react-native";
import LoginScreen from "./LoginScreen";
import { useAppState } from "../hooks/useAppState";
import { useCheckUpdates } from "../hooks/useCheckUpdates";
import * as Linking from "expo-linking";
import { createDrawerNavigator } from "react-navigation-drawer";
import { DrawerNavigationComponent } from "../components/Layout/DrawerNavigation";
import { StackViewTransitionConfigs } from "react-navigation-stack";
import { CampaignInitialisationScreen } from "../components/CampaignInitialisation/CampaignInitialisationScreen";
import { CampaignLocationsScreen } from "../components/CampaignLocations/CampaignLocationsScreen";
import { updateI18nLocale } from "../common/i18n/i18nSetup";
import { LogoutScreen } from "../components/Logout/LogoutScreen";
import { isRootedExperimentalAsync } from "expo-device";
import JailMonkey from "jail-monkey";

export class RootedDeviceDetectedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "RootedDeviceDetectedError";
  }
}

const SwitchNavigator = createSwitchNavigator(
  {
    LoginScreen: { screen: LoginScreen, path: "login" },
    CampaignInitialisationScreen,
    LogoutScreen,
    DrawerNavigator: createDrawerNavigator(
      {
        CampaignLocationsScreen,
        CustomerQuotaStack: {
          screen: CustomerQuotaStack,
        },
        MerchantPayoutStack: {
          screen: MerchantPayoutStack,
        },
      },
      {
        drawerPosition: "right",
        drawerType: "slide",
        contentComponent: DrawerNavigationComponent,
        navigationOptions: {
          transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
          navigationOptions: {
            gesturesEnabled: true,
          },
        },
      }
    ),
  },
  { initialRouteName: "DrawerNavigator" }
);

const AppContainer = createAppContainer(SwitchNavigator);

export const Content = (): ReactElement => {
  const navigatorRef = useRef<NavigationContainerComponent>(null);
  const [rooted, setRooted] = useState<boolean | undefined>(undefined);
  const appState = useAppState();
  const prefix = Linking.makeUrl("/");

  const checkUpdates = useCheckUpdates();

  useEffect(() => {
    if (appState === "active") {
      checkUpdates();
      updateI18nLocale();
    }
  }, [appState, checkUpdates]);

  useEffect(() => {
    isRootedExperimentalAsync().then((result) => {
      const jailBrokenResult = JailMonkey.isJailBroken() || result;
      setRooted(jailBrokenResult);
    });
  }, []);

  if (!__DEV__ && rooted === true) {
    throw new RootedDeviceDetectedError();
  }

  return (
    <>
      <StatusBar />
      <View
        style={{
          flex: 1,
          paddingTop:
            Platform.OS === "android" && !__DEV__ ? StatusBar.currentHeight : 0, // padding is used to prevent content from going behind the status bar on Android production builds
        }}
      >
        <AppContainer ref={navigatorRef} uriPrefix={prefix} />
      </View>
    </>
  );
};
