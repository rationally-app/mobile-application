import React, { ReactElement } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import StackNavigator from "./StackNavigator";
import { StatusBar, View, Platform } from "react-native";
import LoginScreen from "./LoginScreen";
import { AuthenticationContextProvider } from "../context/auth";
import { ConfigContextProvider } from "../context/config";
import { ProductContextProvider } from "../context/products";
import { FontLoader } from "../components/FontLoader";

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
    <AuthenticationContextProvider>
      <ConfigContextProvider>
        <ProductContextProvider>
          <StatusBar />
          <View
            style={{
              flex: 1,
              paddingTop:
                Platform.OS === "android" ? StatusBar.currentHeight : 0
            }}
          >
            <FontLoader>
              <AppContainer />
            </FontLoader>
          </View>
        </ProductContextProvider>
      </ConfigContextProvider>
    </AuthenticationContextProvider>
  );
};

export default App;
