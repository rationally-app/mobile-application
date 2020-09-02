import React, { useEffect, FunctionComponent, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets
} from "@react-navigation/stack";
import { StatusBar, View, Platform } from "react-native";
import LoginScreen from "./LoginScreen";
import { useAppState } from "../hooks/useAppState";
import { useCheckUpdates } from "../hooks/useCheckUpdates";
import * as Linking from "expo-linking";
import { CampaignInitialisationScreen } from "../components/CampaignInitialisation/CampaignInitialisationScreen";
import { AuthStoreContext } from "../context/authStore";
import { useValidateExpiry } from "../hooks/useValidateExpiry";

const Stack = createStackNavigator();

export const Content: FunctionComponent = () => {
  const appState = useAppState();
  const prefix = Linking.makeUrl("/");
  const { hasLoadedFromStore, authCredentials } = useContext(AuthStoreContext);

  const checkUpdates = useCheckUpdates();
  useEffect(() => {
    if (appState === "active") {
      checkUpdates();
    }
  }, [appState, checkUpdates]);

  const validateTokenExpiry = useValidateExpiry();
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
        <NavigationContainer
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
            {hasLoadedFromStore && Object.keys(authCredentials).length === 1 ? (
              <Stack.Screen
                name="CampaignInitialisationScreen"
                component={CampaignInitialisationScreen}
                initialParams={{
                  authCredentials: Object.values(authCredentials)[0]
                }}
              />
            ) : (
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </>
  );
};
