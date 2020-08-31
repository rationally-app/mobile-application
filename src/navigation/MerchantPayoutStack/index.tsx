import {
  createStackNavigator,
  TransitionPresets
} from "@react-navigation/stack";
import MerchantPayoutScreen from "./MerchantPayoutScreen";
import PayoutFeedbackScreen from "./PayoutFeedbackScreen";
import React, { FunctionComponent, useContext } from "react";
import { AuthStoreContext } from "../../context/authStore";
import { CampaignConfigsStoreContext } from "../../context/campaignConfigsStore";
import { AuthContextProvider } from "../../context/auth";
import { CampaignConfigContextProvider } from "../../context/campaignConfig";
import { CustomerQuotaStackProps } from "../../types";

const Stack = createStackNavigator();

const MerchantPayoutStack: FunctionComponent<CustomerQuotaStackProps> = ({
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
          initialRouteName="MerchantPayoutScreen"
          headerMode="none"
          screenOptions={{
            gestureEnabled: true,
            ...TransitionPresets.SlideFromRightIOS
          }}
        >
          <Stack.Screen
            name="MerchantPayoutScreen"
            component={MerchantPayoutScreen}
          />
          <Stack.Screen
            name="PayoutFeedbackScreen"
            component={PayoutFeedbackScreen}
          />
        </Stack.Navigator>
      </CampaignConfigContextProvider>
    </AuthContextProvider>
  );
};

export default MerchantPayoutStack;
