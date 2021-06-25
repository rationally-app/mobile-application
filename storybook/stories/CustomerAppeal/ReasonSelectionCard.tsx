import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { ReasonSelectionCard } from "../../../src/components/CustomerAppeal/ReasonSelection/ReasonSelectionCard";

storiesOf("CustomerAppeal", module).add("ReasonSelectionCard", () => (
  <View style={{ margin: size(3) }}>
    <ReasonSelectionCard
      ids={["S1234567G"]}
      reasonSelectionHeader={"Indicate reason for appeal"}
      reasons={[
        {
          category: "tt-token-lost",
          description: "Lost token",
          descriptionAlert: "*chargeable",
        },
        {
          category: "tt-token-batt",
          description: "Dead battery",
          descriptionAlert: undefined,
        },
        {
          category: "tt-token-damaged",
          description: "Damaged token",
          descriptionAlert: undefined,
        },
        {
          category: "tt-token-defective",
          description: "Defective token",
          descriptionAlert: undefined,
        },
      ]}
      onCancel={() => undefined}
      onReasonSelection={(productName: string, descriptionAlert?: string) =>
        true
      }
    />
  </View>
));
