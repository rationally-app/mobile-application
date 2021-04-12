import React from "react";
import { storiesOf } from "@storybook/react-native";
import { size } from "../../../src/common/styles";
import { View } from "react-native";
import { CheckoutUnsuccessfulCard } from "../../../src/components/CustomerQuota/CheckoutUnsuccessful/CheckoutUnsuccessfulCard";
import {
  TransactionsGroup,
  Transaction,
  TransactionsGroup as TransactionInterface,
} from "../../../src/components/CustomerQuota/TransactionsGroup";
import { BIG_NUMBER } from "../../../src/components/CustomerQuota/utils";

const ids = ["S0000001I", "S0000002G"];

const transactionList: Transaction[] = [
  {
    header: "1 Mar 2021, 3:29PM",
    details: `AAA987654321
  *******8888`,
    isAppeal: false,
    order: 0,
    quantity: "1 qty",
  },
  {
    header: "2 Mar 2021, 3:29PM",
    details: `BBB987654321
    *******8888`,
    isAppeal: true,
    order: 1,
    quantity: "1 qty",
  },
];

const transactionsGroup = {
  header: "TT Token",
  transactions: [transactionList[0]],
  order: 1,
};
const transactionsGroupAppeal: TransactionInterface[] = [
  {
    header: "TT Token",
    transactions: [transactionList[1]],
    order: 1,
  },
  {
    header: "TT Token",
    transactions: [transactionList[0]],
    order: 2,
  },
];

storiesOf("CustomerQuota", module)
  .add("PurchaseUnsuccessCard", () => (
    <View style={{ margin: size(3) }}>
      <CheckoutUnsuccessfulCard ids={ids} onCancel={() => undefined} />
    </View>
  ))
  .add("TransactionsGroup", () => (
    <View style={{ margin: size(3) }}>
      <TransactionsGroup
        key={0}
        maxTransactionsToDisplay={1}
        {...transactionsGroup}
      />
    </View>
  ))
  .add("TransactionsGroupAppeal", () => (
    <View style={{ margin: size(3) }}>
      {transactionsGroupAppeal.map((value, index) => (
        <TransactionsGroup
          key={index}
          maxTransactionsToDisplay={BIG_NUMBER}
          {...value}
        />
      ))}
    </View>
  ));
