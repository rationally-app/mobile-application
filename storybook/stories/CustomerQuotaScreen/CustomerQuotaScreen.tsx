import React from "react";
import { storiesOf } from "@storybook/react-native";
import { CustomerQuotaScreen } from "../../../src/components/CustomerQuota/CustomerQuotaScreen";
import { navigation, setParam } from "../mocks/navigation";

setParam("nric", "S1234567D");
setParam("quota", [
  {
    category: "Mask",
    remainingQuota: 0
  },
  {
    category: "Hand sanitiser",
    remainingQuota: 1
  },
  {
    category: "Thermometer",
    remainingQuota: 1
  }
]);

storiesOf("CustomerQuotaScreen", module).add("CustomerQuotaScreen", () => (
  <CustomerQuotaScreen navigation={navigation} />
));
