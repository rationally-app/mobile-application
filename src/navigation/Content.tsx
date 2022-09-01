import React, { ReactElement, useEffect, useState } from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";

import CustomerQuotaStack from "./CustomerQuotaStack";
import MerchantPayoutStack from "./MerchantPayoutStack";
import { StatusBar, View, Platform } from "react-native";
import LoginScreen from "./LoginScreen";
import { useAppState } from "../hooks/useAppState";
import { useCheckUpdates } from "../hooks/useCheckUpdates";
import * as Linking from "expo-linking";
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import { DrawerNavigationComponent } from "../components/Layout/DrawerNavigation";
import {
  createStackNavigator,
  TransitionPresets,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { CampaignInitialisationScreen } from "../components/CampaignInitialisation/CampaignInitialisationScreen";
import { CampaignLocationsScreen } from "../components/CampaignLocations/CampaignLocationsScreen";
import { updateI18nLocale } from "../common/i18n/i18nSetup";
import { LogoutScreen } from "../components/Logout/LogoutScreen";
import { Drawers, RootStackParams, Screens, Stacks } from "../types";
import { isRootedExperimentalAsync } from "expo-device";

export class RootedDeviceDetectedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "RootedDeviceDetectedError";
  }
}

const Drawer = createDrawerNavigator();
const drawerNavigatorScreenOptions: DrawerNavigationOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  drawerPosition: "right",
  drawerType: "slide",
  headerShown: false,
};
function DrawerNavigator(): JSX.Element {
  return (
    <Drawer.Navigator
      id="RootDrawer"
      drawerContent={DrawerNavigationComponent}
      screenOptions={drawerNavigatorScreenOptions}
    >
      <Drawer.Screen
        name={Screens.CampaignLocationsScreen}
        component={CampaignLocationsScreen}
      />
      <Drawer.Screen
        name={Stacks.CustomerQuotaStack}
        component={CustomerQuotaStack}
      />
      <Drawer.Screen
        name={Stacks.MerchantPayoutStack}
        component={MerchantPayoutStack}
      />
    </Drawer.Navigator>
  );
}
const Stack = createStackNavigator<RootStackParams>();
// TODO consider using NativeStack
// const Stack = createNativeStackNavigator<RootStackParams>();
// https://reactnavigation.org/docs/native-stack-navigator
const screenOptions: StackNavigationOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  gestureEnabled: true,
  headerShown: false,
  animationEnabled: false,
};

export const Content = (): ReactElement => {
  const navigatorRef = useNavigationContainerRef();
  const [rooted, setRooted] = useState<boolean | undefined>(undefined);
  const appState = useAppState();
  const prefix = Linking.createURL("/");

  const checkUpdates = useCheckUpdates();
  const linking = {
    prefixes: [prefix],
  };

  useEffect(() => {
    if (appState === "active") {
      checkUpdates();
      updateI18nLocale();
    }
  }, [appState, checkUpdates]);

  useEffect(() => {
    isRootedExperimentalAsync().then((result) => {
      setRooted(result);
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
        <NavigationContainer ref={navigatorRef} linking={linking}>
          <Stack.Navigator
            id="RootStack"
            initialRouteName={Drawers.MainDrawer}
            screenOptions={screenOptions}
          >
            <Stack.Screen name={Screens.LoginScreen} component={LoginScreen} />
            <Stack.Screen
              name={Screens.CampaignInitialisationScreen}
              component={CampaignInitialisationScreen}
            />
            <Stack.Screen
              name={Screens.LogoutScreen}
              component={LogoutScreen}
            />
            <Stack.Screen
              name={Drawers.MainDrawer}
              component={DrawerNavigator}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </>
  );
};
