import {
  createStackNavigator,
  TransitionPresets,
  StackNavigationOptions,
} from "@react-navigation/stack";
import MerchantPayoutScreen from "./MerchantPayoutScreen";
import PayoutFeedbackScreen from "./PayoutFeedbackScreen";
import React, { FunctionComponent, useContext, useEffect } from "react";
import { AuthStoreContext } from "../../context/authStore";
import { CampaignConfigsStoreContext } from "../../context/campaignConfigsStore";
import { AuthContextProvider } from "../../context/auth";
import { CampaignConfigContextProvider } from "../../context/campaignConfig";
import {
  MerchantPayoutStackScreenProps,
  MerchantPayoutStackParams,
  Screens,
} from "../../types";

const Stack = createStackNavigator<MerchantPayoutStackParams>();

const screenOptions: StackNavigationOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  gestureEnabled: true,
  headerShown: false,
};

const MerchantPayoutStack: FunctionComponent<
  MerchantPayoutStackScreenProps
> = ({ navigation, route }) => {
  const operatorToken =
    route.params?.operatorToken || route.params?.params?.operatorToken;
  const endpoint = route.params?.endpoint || route.params?.params?.endpoint;

  const key = `${operatorToken}${endpoint}`;

  const { authCredentials } = useContext(AuthStoreContext);
  const { allCampaignConfigs } = useContext(CampaignConfigsStoreContext);
  const hasDataFromStore = authCredentials[key] && allCampaignConfigs[key];

  useEffect(() => {
    if (!hasDataFromStore) {
      navigation.navigate(Screens.CampaignLocationsScreen, {
        shouldAutoLoad: true,
      });
    }
  }, [hasDataFromStore, navigation]);

  return hasDataFromStore ? (
    <AuthContextProvider authCredentials={authCredentials[key]!}>
      <CampaignConfigContextProvider campaignConfig={allCampaignConfigs[key]!}>
        <Stack.Navigator
          initialRouteName={Screens.MerchantPayoutScreen}
          screenOptions={screenOptions}
        >
          <Stack.Screen
            name={Screens.MerchantPayoutScreen}
            component={MerchantPayoutScreen}
          />
          <Stack.Screen
            name={Screens.PayoutFeedbackScreen}
            component={PayoutFeedbackScreen}
          />
        </Stack.Navigator>
      </CampaignConfigContextProvider>
    </AuthContextProvider>
  ) : null;
};
// MerchantPayoutStack.router = Stack.router;

export default MerchantPayoutStack;
