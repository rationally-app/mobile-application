import React, { ReactElement, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets
} from "@react-navigation/stack";
import CustomerQuotaStack from "./CustomerQuotaStack";
import MerchantPayoutStack from "./MerchantPayoutStack";
import { StatusBar, View, Platform } from "react-native";
import LoginScreen from "./LoginScreen";
import { useAppState } from "../hooks/useAppState";
import { useCheckUpdates } from "../hooks/useCheckUpdates";
import * as Linking from "expo-linking";
import { DrawerNavigationComponent } from "../components/Layout/DrawerNavigation";
import { CampaignInitialisationScreen } from "../components/CampaignInitialisation/CampaignInitialisationScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// const SwitchNavigator = createSwitchNavigator(
//   {
//     LoginScreen: { screen: LoginScreen, path: "login" },
//     CampaignInitialisationScreen,
//     DrawerNavigator: createDrawerNavigator(
//       {
//         CustomerQuotaStack: {
//           screen: CustomerQuotaStack
//         },
//         MerchantPayoutStack: {
//           screen: MerchantPayoutStack
//         }
//       },
//       {
//         drawerPosition: "right",
//         drawerType: "slide",
//         contentComponent: DrawerNavigationComponent,
//         navigationOptions: {
//           transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
//           navigationOptions: {
//             gesturesEnabled: true
//           }
//         }
//       }
//     )
//   },
//   { initialRouteName: "LoginScreen" }
// );

// const AppContainer = createAppContainer(SwitchNavigator);

export const Content = (): ReactElement => {
  const navigatorRef = React.useRef(null);
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
        <NavigationContainer
          ref={navigatorRef}
          linking={{
            prefixes: [prefix]
          }}
        >
          <Stack.Navigator
            initialRouteName="LoginScreen"
            screenOptions={{
              gestureEnabled: true,
              ...TransitionPresets.SlideFromRightIOS
            }}
          >
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen
              name="CampaignInitialisationScreen"
              component={CampaignInitialisationScreen}
            />
            <Drawer.Navigator
              initialRouteName="Home"
              drawerPosition="right"
              drawerType="slide"
              drawerContent={DrawerNavigationComponent}
            >
              <Drawer.Screen
                name="CustomerQuotaStack"
                component={CustomerQuotaStack}
              />
              <Drawer.Screen
                name="MerchantPayoutStack"
                component={MerchantPayoutStack}
              />
            </Drawer.Navigator>
          </Stack.Navigator>
        </NavigationContainer>
        {/* <AppContainer ref={navigatorRef} uriPrefix={prefix} /> */}
      </View>
    </>
  );
};
