import React from "react";
import { storiesOf } from "@storybook/react-native";
import { CustomerQuotaScreen } from "../../../src/components/CustomerQuota/CustomerQuotaScreen";
import { navigation, setParam } from "../mocks/navigation";

setParam("nric", "S0000000J");
setParam("quota", {
  remainingQuota: 4,
  history: [
    {
      quantity: 1,
      transactionTime: Date.now() - 1000
    }
  ]
});

storiesOf("CustomerQuotaScreen", module).add("CustomerQuotaScreen", () => (
  <CustomerQuotaScreen navigation={navigation} />
));
