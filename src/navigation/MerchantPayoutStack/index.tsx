import {
  createStackNavigator,
  StackViewTransitionConfigs
} from "react-navigation-stack";
import MerchantPayoutScreen from "./MerchantPayoutScreen";
import PayoutFeedbackScreen from "./PayoutFeedbackScreen";

const MerchantPayoutStack = createStackNavigator(
  {
    MerchantPayoutScreen: {
      screen: MerchantPayoutScreen
    },
    PayoutFeedbackScreen: {
      screen: PayoutFeedbackScreen
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
