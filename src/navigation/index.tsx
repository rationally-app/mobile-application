import React, { ReactElement } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import StackNavigator from "./StackNavigator";
import { StatusBar, View, Platform } from "react-native";
import LoginScreen from "./LoginScreen";
import { AuthenticationContextProvider } from "../context/auth";
import { ConfigContextProvider } from "../context/config";
import { ProductContextProvider } from "../context/products";
import { FontLoader } from "../components/FontLoader";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";
import { HelpModalContextProvider } from "../context/help";

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
    <ErrorBoundary>
      <FontLoader>
        <AuthenticationContextProvider>
          <ConfigContextProvider>
            <ProductContextProvider>
              <HelpModalContextProvider>
                <StatusBar />
                <View
                  style={{
                    flex: 1,
                    paddingTop:
                      Platform.OS === "android" ? StatusBar.currentHeight : 0
                  }}
                >
                  <AppContainer />
                </View>
              </HelpModalContextProvider>
            </ProductContextProvider>
          </ConfigContextProvider>
        </AuthenticationContextProvider>
      </FontLoader>
    </ErrorBoundary>
  );
};

export default App;
