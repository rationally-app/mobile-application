import {
  createStackNavigator,
  StackViewTransitionConfigs
} from "react-navigation-stack";
import CollectCustomerDetailsScreen from "./CollectCustomerDetailsScreen";
import CustomerAppealScreen from "./CustomerAppealScreen";
import { CustomerQuotaProxy } from "../../components/CustomerQuota/CustomerQuotaProxy";
import React, { FunctionComponent, useContext, useEffect } from "react";
import { NavigationInjectedProps } from "react-navigation";
import { AuthStoreContext } from "../../context/authStore";
import { CampaignConfigsStoreContext } from "../../context/campaignConfigsStore";
import { AuthContextProvider } from "../../context/auth";
import { CampaignConfigContextProvider } from "../../context/campaignConfig";

const Stack = createStackNavigator(
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

const CustomerQuotaStack: FunctionComponent<NavigationInjectedProps> & {
  router: unknown;
} = ({ navigation }) => {
  const operatorToken = navigation.getParam("operatorToken");
  const endpoint = navigation.getParam("endpoint");

  const key = `${operatorToken}${endpoint}`;

  const { authCredentials } = useContext(AuthStoreContext);
  const { allCampaignConfigs } = useContext(CampaignConfigsStoreContext);
  const hasDataFromStore = authCredentials[key] && allCampaignConfigs[key];

  useEffect(() => {
    if (!hasDataFromStore) {
      navigation.navigate("CampaignLocationsScreen");
    }
  }, [hasDataFromStore, navigation]);

  return hasDataFromStore ? (
    <AuthContextProvider authCredentials={authCredentials[key]!}>
      <CampaignConfigContextProvider campaignConfig={allCampaignConfigs[key]!}>
        <Stack navigation={navigation} />
      </CampaignConfigContextProvider>
    </AuthContextProvider>
  ) : null;
};

CustomerQuotaStack.router = Stack.router;

export default CustomerQuotaStack;
