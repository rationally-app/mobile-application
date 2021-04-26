import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import CollectCustomerDetailsScreen from "../../../src/navigation/CustomerQuotaStack/CollectCustomerDetailsScreen";
import { mockReactNavigationDecorator } from "../mocks/navigation";

storiesOf("CustomerDetails", module)
  .addDecorator((Story: any) => mockReactNavigationDecorator(Story))
  .add("Screen", () => (
    <View>
      <CollectCustomerDetailsScreen />
    </View>
  ));
