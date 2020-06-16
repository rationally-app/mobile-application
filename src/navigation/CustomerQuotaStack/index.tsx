import {
  createStackNavigator,
  StackViewTransitionConfigs
} from "react-navigation-stack";
import CollectCustomerDetailsScreen from "./CollectCustomerDetailsScreen";
import CustomerQuotaScreen from "./CustomerQuotaScreen";
import MerchantPayoutScreen from "./MerchantPayoutScreen";

const CustomerQuotaStack = createStackNavigator(
  {
    CustomerQuotaStack: createStackNavigator(
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
    ),
    MerchantPayoutStack: createStackNavigator(
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
        }
      }
    )
  },
  {
    headerMode: "none",
    initialRouteName: "CustomerQuotaStack"
  }
);

export default CustomerQuotaStack;
