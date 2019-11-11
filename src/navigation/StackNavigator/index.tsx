import { createStackNavigator } from "react-navigation-stack";
import MainScreen from "./MainScreen";

const StackNavigator = createStackNavigator(
  {
    MainScreen: {
      screen: MainScreen
    }
  },
  {
    headerMode: "none"
  }
);

export default StackNavigator;
