import React, { ReactElement, useRef, useEffect } from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationContainerComponent
} from "react-navigation";
import CustomerQuotaStack from "./CustomerQuotaStack";
import MerchantPayoutStack from "./MerchantPayoutStack";
import StatisticsStack from "./StatisticsStack";
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

const SwitchNavigator = createSwitchNavigator(
  {
    LoginScreen: { screen: LoginScreen, path: "login" },
    CampaignInitialisationScreen,
    DrawerNavigator: createDrawerNavigator(
      {
        CampaignLocationsScreen,
        CustomerQuotaStack: {
          screen: CustomerQuotaStack
        },
        MerchantPayoutStack: {
          screen: MerchantPayoutStack
        },
        StatisticsStack: {
          screen: StatisticsStack
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
  { initialRouteName: "DrawerNavigator" }
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
