import {
  createStackNavigator,
  StackViewTransitionConfigs
} from "react-navigation-stack";
import CollectCustomerDetailsScreen from "./CollectCustomerDetailsScreen";
import CustomerQuotaScreen from "./CustomerQuotaScreen";

const StackNavigator = createStackNavigator(
  {
    CollectCustomerDetailsScreen: {
      screen: CollectCustomerDetailsScreen
    },
    CustomerQuotaScreen: {
      screen: CustomerQuotaScreen
    }
  },
  {
    headerMode: "none",
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
    navigationOptions: {
      gesturesEnabled: true
    }
  }
);

export default StackNavigator;
