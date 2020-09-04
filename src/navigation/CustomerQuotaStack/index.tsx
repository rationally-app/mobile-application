import {
  createStackNavigator,
  TransitionPresets
} from "@react-navigation/stack";
import CollectCustomerDetailsScreen from "./CollectCustomerDetailsScreen";
import CustomerAppealScreen from "./CustomerAppealScreen";
import { CustomerQuotaProxy } from "../../components/CustomerQuota/CustomerQuotaProxy";
import React, { FunctionComponent, useContext } from "react";
import { AuthStoreContext } from "../../context/authStore";
import { CampaignConfigsStoreContext } from "../../context/campaignConfigsStore";
import { AuthContextProvider } from "../../context/auth";
import { CampaignConfigContextProvider } from "../../context/campaignConfig";
import { CustomerQuotaStackProps } from "../../types";

const Stack = createStackNavigator();

const CustomerQuotaStack: FunctionComponent<CustomerQuotaStackProps> = ({
  route
}) => {
  const { operatorToken, endpoint } = route.params;

  const key = `${operatorToken}${endpoint}`;

  const { authCredentials } = useContext(AuthStoreContext);
  if (!authCredentials[key]) {
    throw new Error("No auth credentials found");
  }

  const { allCampaignConfigs } = useContext(CampaignConfigsStoreContext);
  if (!allCampaignConfigs[key]) {
    throw new Error("No campaign config found");
  }

  return (
    <AuthContextProvider authCredentials={authCredentials[key]!}>
      <CampaignConfigContextProvider campaignConfig={allCampaignConfigs[key]!}>
        <Stack.Navigator
          initialRouteName="CollectCustomerDetailsScreen"
          headerMode="none"
          screenOptions={{
            gestureEnabled: true,
            ...TransitionPresets.SlideFromRightIOS
          }}
        >
          <Stack.Screen
            name="CollectCustomerDetailsScreen"
            component={CollectCustomerDetailsScreen}
          />
          <Stack.Screen
            name="CustomerQuotaProxy"
            component={CustomerQuotaProxy}
          />
          <Stack.Screen
            name="CustomerAppealScreen"
            component={CustomerAppealScreen}
          />
        </Stack.Navigator>
      </CampaignConfigContextProvider>
    </AuthContextProvider>
  );
};

export default CustomerQuotaStack;
