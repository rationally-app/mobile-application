import { createAppContainer, createSwitchNavigator } from "react-navigation";
import StackNavigator from "./StackNavigator";
import LoadingScreen from "./LoadingScreen";

const SwitchNavigator = createSwitchNavigator(
  { LoadingScreen, StackNavigator },
  { initialRouteName: "LoadingScreen" }
);

export default createAppContainer(SwitchNavigator);
