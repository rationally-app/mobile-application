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
        { description: "Lost/stolen token", descriptionAlert: "*chargeable" },
        { description: "Dead battery", descriptionAlert: undefined },
        { description: "Damaged token", descriptionAlert: undefined }
      ]}
      onCancel={() => undefined}
      onReasonSelection={(productName: string, descriptionAlert?: string) =>
        true
      }
    />
  </View>
));
