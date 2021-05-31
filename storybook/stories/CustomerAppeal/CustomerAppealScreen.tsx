import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { CustomerAppealScreen } from "../../../src/components/CustomerAppeal/CustomerAppealScreen";
import { CampaignPolicy } from "../../../src/types";
import { navigation, mockReactNavigationDecorator } from "../mocks/navigation";
import { provider as MockProvider } from "../mocks/provider";

const products: CampaignPolicy[] = [
  {
    category: "Lost token",
    categoryType: "APPEAL",
    name: "Lost token",
    alert: {
      label: "*chargeable",
      threshold: 7,
    },
    order: 1,
    quantity: {
      period: 7,
      limit: 2,
    },
  },
  {
    category: "Dead battery",
    categoryType: "APPEAL",
    name: "Dead battery",
    order: 2,
    quantity: {
      period: 7,
      limit: 2,
    },
  },
  {
    category: "Damaged token",
    categoryType: "APPEAL",
    name: "Damaged token",
    order: 3,
    quantity: {
      period: 7,
      limit: 2,
    },
  },
  {
    category: "Defective token",
    categoryType: "APPEAL",
    name: "Defective token",
    order: 4,
    quantity: {
      period: 7,
      limit: 2,
    },
  },
];

storiesOf("Screen", module)
  .addDecorator((Story: any) => (
    <MockProvider
      policies={products}
      story={mockReactNavigationDecorator(Story)}
    />
  ))
  .add("CustomerAppeal", () => {
    return (
      <View>
        <CustomerAppealScreen
          navigation={{ ...navigation, ...{ getParam: () => ["S1412284B"] } }}
        />
      </View>
    );
  });
