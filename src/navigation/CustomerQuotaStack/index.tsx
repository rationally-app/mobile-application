import {
  createStackNavigator,
  TransitionPresets,
  StackNavigationOptions,
} from "@react-navigation/stack";

import CollectCustomerDetailsScreen from "./CollectCustomerDetailsScreen";
import CustomerAppealScreen from "./CustomerAppealScreen";
import { CustomerQuotaProxy } from "../../components/CustomerQuota/CustomerQuotaProxy";
import React, { FunctionComponent, useContext, useEffect } from "react";
import { AuthStoreContext } from "../../context/authStore";
import { CampaignConfigsStoreContext } from "../../context/campaignConfigsStore";
import { AuthContextProvider } from "../../context/auth";
import { CampaignConfigContextProvider } from "../../context/campaignConfig";
import DailyStatisticsScreen from "./DailyStatisticsScreen";
import { useTheme } from "../../context/theme";
import {
  CustomerQuotaStackParams,
  CustomerQuotaStackScreenProps,
  Screens,
} from "../../types";

const Stack = createStackNavigator<CustomerQuotaStackParams>();

const screenOptions: StackNavigationOptions = {
  cardStyle: { backgroundColor: "#F5F5F5" },
  ...TransitionPresets.SlideFromRightIOS,
  gestureEnabled: true,
  headerShown: false,
};

const CustomerQuotaStack: FunctionComponent<CustomerQuotaStackScreenProps> = ({
  navigation,
  route,
}) => {
  const operatorToken =
    route.params?.operatorToken || route.params?.params?.operatorToken;
  const endpoint = route.params?.endpoint || route.params?.params?.endpoint;

  const key = `${operatorToken}${endpoint}`;

  const { authCredentials } = useContext(AuthStoreContext);
  const { allCampaignConfigs } = useContext(CampaignConfigsStoreContext);
  const hasDataFromStore = authCredentials[key] && allCampaignConfigs[key];

  const { setTheme } = useTheme();
  useEffect(() => {
    if (!hasDataFromStore) {
      navigation.navigate(Screens.CampaignLocationsScreen, {
        shouldAutoLoad: true,
      });
    }
  }, [hasDataFromStore, navigation]);

  useEffect(() => {
    if (!allCampaignConfigs[key]) {
      return;
    }
    const { features } = allCampaignConfigs[key]!;
    if (features) {
      setTheme(features.theme);
    }
  }, [allCampaignConfigs, key, setTheme]);

  return hasDataFromStore ? (
    <AuthContextProvider authCredentials={authCredentials[key]!}>
      <CampaignConfigContextProvider campaignConfig={allCampaignConfigs[key]!}>
        <Stack.Navigator
          initialRouteName={Screens.CollectCustomerDetailsScreen}
          screenOptions={screenOptions}
        >
          <Stack.Screen
            name={Screens.CollectCustomerDetailsScreen}
            component={CollectCustomerDetailsScreen}
          />
          <Stack.Screen
            name={Screens.CustomerQuotaProxy}
            component={CustomerQuotaProxy}
          />
          <Stack.Screen
            name={Screens.CustomerAppealScreen}
            component={CustomerAppealScreen}
          />
          <Stack.Screen
            name={Screens.DailyStatisticsScreen}
            component={DailyStatisticsScreen}
          />
        </Stack.Navigator>
      </CampaignConfigContextProvider>
    </AuthContextProvider>
  ) : null;
};

export default CustomerQuotaStack;
