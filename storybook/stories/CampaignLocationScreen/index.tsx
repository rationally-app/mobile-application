import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { CampaignLocationsScreen } from "../../../src/components/CampaignLocations/CampaignLocationsScreen";
import { navigation, mockReactNavigationDecorator } from "../mocks/navigation";
import { CampaignConfigsStoreContext } from "../../../src/context/campaignConfigsStore";
import { AuthStoreContext } from "../../../src/context/authStore";
import {
  defaultFeatures,
  defaultProducts,
} from "../../../src/test/helpers/defaults";

storiesOf("CampaignLocation", module)
  .addDecorator((Story: any) => (
    <AuthStoreContext.Provider
      value={{
        hasLoadedFromStore: true,
        authCredentials: {
          "Campaign 1": {
            operatorToken: "operatorToken",
            sessionToken: "sessionToken",
            expiry: new Date().setDate(new Date().getDate() + 1),
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
          allCampaignConfigs: {
            "Campaign 1": {
              policies: defaultProducts,
              features: defaultFeatures,
              c13n: {},
            },
          },
          setCampaignConfig: () => undefined,
          removeCampaignConfig: () => undefined,
          clearCampaignConfigs: () => undefined,
        }}
      >
        {mockReactNavigationDecorator(Story)}
      </CampaignConfigsStoreContext.Provider>
    </AuthStoreContext.Provider>
  ))
  .add("Screen", () => (
    <View>
      <CampaignLocationsScreen navigation={navigation} />
    </View>
  ));
