import React from "react";
import { storiesOf } from "@storybook/react-native";
import { CustomerCard } from "../../../src/components/CustomerQuota/CustomerCard";
import { View, Text } from "react-native";
import { color, size } from "../../../src/common/styles";

storiesOf("CustomerQuotaScreen", module).add("CustomerCard", () => (
  <View style={{ margin: size(3) }}>
    <CustomerCard nric="S1234567D">
      <View style={{ backgroundColor: color("red", 10), padding: size(3) }}>
        <Text>Content</Text>
      </View>
    </CustomerCard>
  </View>
));
