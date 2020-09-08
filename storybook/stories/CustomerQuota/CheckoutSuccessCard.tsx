import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { CheckoutSuccessCard } from "../../../src/components/CustomerQuota/CheckoutSuccess/CheckoutSuccessCard";
import { ProductContextProvider } from "../../../src/context/products";
import {
  PostTransactionResult,
  CampaignPolicy,
  Quota
} from "../../../src/types";
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

const transactionTime = new Date(2020, 3, 1);
const checkoutResult: PostTransactionResult = {
  transactions: [
    {
      transaction: [
        {
          category: "toilet-paper",
          quantity: 0,
          identifierInputs: []
        },
        {
          category: "chocolate",
          quantity: 5,
          identifierInputs: []
        }
      ],
      timestamp: transactionTime
    },
    {
      transaction: [
        {
          category: "toilet-paper",
          quantity: 1,
          identifierInputs: []
        },
        {
          category: "chocolate",
          quantity: 3,
          identifierInputs: []
        }
      ],
      timestamp: transactionTime
    }
  ]
};

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
      features: null
    }}
  >
    <ProductContextProvider products={products}>
      <View style={{ margin: size(3) }}>
        <CheckoutSuccessCard
          ids={["S0000001I", "S0000002G"]}
          onCancel={() => null}
          checkoutResult={checkoutResult}
          quotaResponse={quotaResponse}
        />
      </View>
    </ProductContextProvider>
  </CampaignConfigContext.Provider>
));
