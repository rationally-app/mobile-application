import {
  createStackNavigator,
  StackViewTransitionConfigs
} from "react-navigation-stack";
import MerchantPayoutScreen from "./MerchantPayoutScreen";

const MerchantPayoutStack = createStackNavigator(
  {
    MerchantPayoutScreen: {
      screen: MerchantPayoutScreen
    }
  },
  {
    headerMode: "none",
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
    navigationOptions: {
      gesturesEnabled: true
    },
    initialRouteName: "MerchantPayoutScreen"
  }
);

export default MerchantPayoutStack;
