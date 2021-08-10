import { storiesOf } from "@storybook/react-native";
import React from "react";
import { View } from "react-native";
import { LogoutScreen } from "../../../src/components/Logout/LogoutScreen";
import { AuthStoreContext } from "../../../src/context/authStore";
import { CampaignConfigsStoreContext } from "../../../src/context/campaignConfigsStore";
import { navigation } from "../mocks/navigation";

storiesOf("Logout", module)
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
        <Story />
      </CampaignConfigsStoreContext.Provider>
    </AuthStoreContext.Provider>
  ))
  .add("LogoutScreen", () => (
    <View style={{ height: "100%" }}>
      <LogoutScreen navigation={navigation} />
    </View>
  ));
