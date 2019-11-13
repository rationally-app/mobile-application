import React, { ReactElement } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { DbContextProvider } from "../context/db";
import StackNavigator from "./StackNavigator";
import LoadingScreen from "./LoadingScreen";

const SwitchNavigator = createSwitchNavigator(
  { LoadingScreen, StackNavigator },
  { initialRouteName: "LoadingScreen" }
);

const AppContainer = createAppContainer(SwitchNavigator);

const App = (): ReactElement => (
  <DbContextProvider>
    <AppContainer />
  </DbContextProvider>
);

export default App;
