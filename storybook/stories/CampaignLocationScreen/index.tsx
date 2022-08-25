import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { CampaignLocationsScreen } from "../../../src/components/CampaignLocations/CampaignLocationsScreen";
import { navigation, mockReactNavigationDecorator } from "../mocks/navigation";
import { CampaignConfigsStoreContext } from "../../../src/context/campaignConfigsStore";
import { AuthStoreContext } from "../../../src/context/authStore";

storiesOf("Screen", module)
  .addDecorator((Story: any) => (
    <AuthStoreContext.Provider
      value={{
        hasLoadedFromStore: true,
        authCredentials: {
          "Campaign 1": {
            operatorToken: "operatorToken",
            sessionToken: "sessionToken",
            expiry: Date.now() + 86400000, // 1 day in millisecond
            endpoint: "Endpoint",
          },
          "Campaign 2": {
            operatorToken: "operatorToken",
            sessionToken: "sessionToken",
            expiry: Date.now(),
            endpoint: "Endpoint",
          },
        },
        setAuthCredentials: () => undefined,
        removeAuthCredentials: () => undefined,
        clearAuthCredentials: () => undefined,
      }}
    >
      <CampaignConfigsStoreContext.Provider
        value={{
          hasLoadedFromStore: true,
          allCampaignConfigs: {},
          setCampaignConfig: () => undefined,
          removeCampaignConfig: () => undefined,
          clearCampaignConfigs: () => undefined,
        }}
      >
        {mockReactNavigationDecorator(Story)}
      </CampaignConfigsStoreContext.Provider>
    </AuthStoreContext.Provider>
  ))
  .add("CampaignLocation", () => (
    <View>
      <CampaignLocationsScreen route={{} as any} navigation={navigation} />
    </View>
  ));
