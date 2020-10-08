import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { CheckoutSuccessCard } from "../../../src/components/CustomerQuota/CheckoutSuccess/CheckoutSuccessCard";
import { Quota, CampaignPolicy } from "../../../src/types";
import { CampaignConfigContext } from "../../../src/context/campaignConfig";

const products: CampaignPolicy[] = [
  {
    category: "toilet-paper",
    name: "🧻 Toilet Paper",
    description: "",
    order: 1,
    quantity: {
      period: 7,
      limit: 2,
      default: 1,
      unit: {
        type: "POSTFIX",
        label: " roll(s)"
      }
    }
  },
  {
    category: "chocolate",
    name: "🍫 Chocolate",
    order: 2,
    quantity: {
      period: 7,
      limit: 15,
      default: 0,
      unit: {
        type: "POSTFIX",
        label: " bar(s)"
      }
    }
  }
];

const quotaResponse: Quota = {
  remainingQuota: [
    { category: "toilet-paper", quantity: 1 },
    { category: "chocolate", quantity: 7 }
  ]
};

storiesOf("CustomerQuota", module).add("PurchaseSuccessCard", () => (
  <CampaignConfigContext.Provider
    value={{
      policies: products,
      features: null,
      c13n: {}
    }}
  >
    <View style={{ margin: size(3) }}>
      <CheckoutSuccessCard
        ids={["S0000001I", "S0000002G"]}
        onCancel={() => null}
        quotaResponse={quotaResponse}
      />
    </View>
  </CampaignConfigContext.Provider>
));
