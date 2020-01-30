import {
  createStackNavigator,
  StackViewTransitionConfigs
} from "react-navigation-stack";
import CollectCustomerDetailsScreen from "./CollectCustomerDetailsScreen";
import CustomerQuotaScreen from "./CustomerQuotaScreen";
import TransactionConfirmationScreen from "./TransactionConfirmationScreen";

const StackNavigator = createStackNavigator(
  {
    CollectCustomerDetailsScreen: {
      screen: CollectCustomerDetailsScreen
    },
    CustomerQuotaScreen: {
      screen: CustomerQuotaScreen
    },
    TransactionConfirmationScreen: {
      screen: TransactionConfirmationScreen
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
