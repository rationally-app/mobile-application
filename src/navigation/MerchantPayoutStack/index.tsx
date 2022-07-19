import {
  createStackNavigator,
  TransitionPresets,
  StackNavigationOptions,
  StackScreenProps,
} from "@react-navigation/stack";
import MerchantPayoutScreen from "./MerchantPayoutScreen";
import PayoutFeedbackScreen from "./PayoutFeedbackScreen";
import React, { FunctionComponent, useContext, useEffect } from "react";
import { AuthStoreContext } from "../../context/authStore";
import { CampaignConfigsStoreContext } from "../../context/campaignConfigsStore";
import { AuthContextProvider } from "../../context/auth";
import { CampaignConfigContextProvider } from "../../context/campaignConfig";
import { MerchantPayoutStackParamList, RootDrawerParamList } from "../../types";
import { DrawerScreenProps } from "@react-navigation/drawer";

const Stack = createStackNavigator<MerchantPayoutStackParamList>();

const screenOptions: StackNavigationOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  gestureEnabled: true,
  headerShown: false,
};

const MerchantPayoutStack: FunctionComponent<
  DrawerScreenProps<RootDrawerParamList, "MerchantPayoutStack">
> = (navigation, route) => {
  const operatorToken = route.params.operatorToken;
  const endpoint = route.params.endpoint;

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
        {/* <Stack navigation={navigation} /> */}
        <Stack.Navigator
          screenOptions={screenOptions}
          initialRouteName="MerchantPayoutScreen"
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
  ) : null;
};
// MerchantPayoutStack.router = Stack.router;

export default MerchantPayoutStack;
