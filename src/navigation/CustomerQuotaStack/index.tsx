import {
  createStackNavigator,
  TransitionPresets,
  StackNavigationOptions,
  StackScreenProps,
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
import { CustomerQuotaStackParamList } from "../../types";

type Props = StackScreenProps<
  CustomerQuotaStackParamList,
  "CustomerQuotaProxy"
>;

const Stack = createStackNavigator<CustomerQuotaStackParamList>();

const screenOptions: StackNavigationOptions = {
  cardStyle: { backgroundColor: "#F5F5F5" },
  ...TransitionPresets.SlideFromRightIOS,
  gestureEnabled: true,
  headerShown: false,
};

const CustomerQuotaStack: FunctionComponent<Props> = ({
  navigation,
  route,
}) => {
  const operatorToken = route.params?.operatorToken;
  const endpoint = route.params?.endpoint;

  const key = `${operatorToken}${endpoint}`;

  const { authCredentials } = useContext(AuthStoreContext);
  const { allCampaignConfigs } = useContext(CampaignConfigsStoreContext);
  const hasDataFromStore = authCredentials[key] && allCampaignConfigs[key];

  const { setTheme } = useTheme();
  useEffect(() => {
    if (!hasDataFromStore) {
      navigation.getParent()?.navigate("CampaignLocationsScreen");
    }
  }, [hasDataFromStore, navigation]);

  useEffect(() => {
    const { features } = allCampaignConfigs[key]!;
    if (features) {
      setTheme(features.theme);
    }
  }, [allCampaignConfigs, key, setTheme]);

  return hasDataFromStore ? (
    <AuthContextProvider authCredentials={authCredentials[key]!}>
      <CampaignConfigContextProvider campaignConfig={allCampaignConfigs[key]!}>
        {/* <Stack navigation={navigation} /> */}
        <Stack.Navigator screenOptions={screenOptions}>
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
          <Stack.Screen
            name="DailyStatisticsScreen"
            component={DailyStatisticsScreen}
          />
        </Stack.Navigator>
      </CampaignConfigContextProvider>
    </AuthContextProvider>
  ) : null;
};

export default CustomerQuotaStack;
