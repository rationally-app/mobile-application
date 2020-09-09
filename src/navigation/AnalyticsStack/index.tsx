import {
  createStackNavigator,
  StackViewTransitionConfigs
} from "react-navigation-stack";
import DailyAnalyticsScreen from "./DailyAnalyticsScreen";

const AnalyticsStack = createStackNavigator(
  {
    DailyAnalyticsScreen: {
      screen: DailyAnalyticsScreen
    }
  },
  {
    headerMode: "none",
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
    navigationOptions: {
      gesturesEnabled: true
    },
    initialRouteName: "DailyAnalyticsScreen"
  }
);

export default AnalyticsStack;
