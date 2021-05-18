import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size, color } from "../../../src/common/styles";
import { CheckoutSuccessCard } from "../../../src/components/CustomerQuota/CheckoutSuccess/CheckoutSuccessCard";
import { RedeemedItem } from "../../../src/components/CustomerQuota/CheckoutSuccess/RedeemedItem";
import { PurchasedItem } from "../../../src/components/CustomerQuota/CheckoutSuccess/PurchasedItem";
import { Quota, CampaignPolicy } from "../../../src/types";
import { CampaignConfigContext } from "../../../src/context/campaignConfig";
import { ItemQuantities } from "../../../src/components/CustomerQuota/types";

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
        label: " roll(s)",
      },
    },
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
        label: " bar(s)",
      },
    },
  },
];

const quotaResponse: Quota = {
  remainingQuota: [
    { category: "toilet-paper", quantity: 1 },
    { category: "chocolate", quantity: 7 },
  ],
  globalQuota: [
    { category: "toilet-paper", quantity: 1 },
    { category: "chocolate", quantity: 7 },
  ],
  localQuota: [
    { category: "toilet-paper", quantity: Number.MAX_SAFE_INTEGER },
    { category: "chocolate", quantity: Number.MAX_SAFE_INTEGER },
  ],
};

const itemQuantities: ItemQuantities = {
  category: "toilet-paper",
  quantities: {
    "roll(s)": 2,
  },
};

storiesOf("CustomerQuota", module)
  .addDecorator((Story: any) => (
    <CampaignConfigContext.Provider
      value={{
        policies: products,
        features: null,
        c13n: {},
      }}
    >
      <Story />
    </CampaignConfigContext.Provider>
  ))
  .add("PurchaseSuccessCard", () => (
    <View key="0" style={{ margin: size(3) }}>
      <CheckoutSuccessCard
        ids={["S0000001I", "S0000002G"]}
        onCancel={() => null}
        quotaResponse={quotaResponse}
      />
    </View>
  ))
  .add("RedeemedItem", () => (
    <View
      key="1"
      style={{ margin: size(3), backgroundColor: color("orange", 30) }}
    >
      <RedeemedItem itemQuantities={itemQuantities} />
    </View>
  ))
  .add("PurchasedItem", () => (
    <View
      key="2"
      style={{ margin: size(3), backgroundColor: color("orange", 30) }}
    >
      <PurchasedItem itemQuantities={itemQuantities} />
    </View>
  ));
