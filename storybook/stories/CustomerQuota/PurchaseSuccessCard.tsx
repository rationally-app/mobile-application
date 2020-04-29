import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { PurchaseSuccessCard } from "../../../src/components/CustomerQuota/PurchaseSuccessCard";
import { ProductContext } from "../../../src/context/products";
import { Policy, PostTransactionResult } from "../../../src/types";

const products: Policy[] = [
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
          quantity: 0
        },
        {
          category: "chocolate",
          quantity: 5
        }
      ],
      timestamp: transactionTime
    },
    {
      transaction: [
        {
          category: "toilet-paper",
          quantity: 1
        },
        {
          category: "chocolate",
          quantity: 3
        }
      ],
      timestamp: transactionTime
    }
  ]
};

const getProduct = (category: string): Policy | undefined =>
  products?.find(product => product.category === category) ?? undefined;

storiesOf("CustomerQuota", module).add("PurchaseSuccessCard", () => (
  <ProductContext.Provider
    value={{ products, getProduct, setProducts: () => null }}
  >
    <View style={{ margin: size(3) }}>
      <PurchaseSuccessCard
        nrics={["S0000001I", "S0000002G"]}
        onCancel={() => null}
        checkoutResult={checkoutResult}
      />
    </View>
  </ProductContext.Provider>
));
