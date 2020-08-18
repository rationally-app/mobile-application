import {
  createStackNavigator,
  StackViewTransitionConfigs
} from "react-navigation-stack";
import CollectCustomerDetailsScreen from "./CollectCustomerDetailsScreen";
import CustomerAppealScreen from "./CustomerAppealScreen";
import { CustomerQuotaProxy } from "../../components/CustomerQuota/CustomerQuotaProxy";

const CustomerQuotaStack = createStackNavigator(
  {
    CollectCustomerDetailsScreen: {
      screen: CollectCustomerDetailsScreen
    },
    CustomerQuotaProxy: {
      screen: CustomerQuotaProxy
    },
    CustomerAppealScreen: {
      screen: CustomerAppealScreen
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

export default CustomerQuotaStack;
