import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { ReasonSelectionCard } from "../../../src/components/CustomerAppeal/ReasonSelection/ReasonSelectionCard";

storiesOf("CustomerAppeal", module).add("ReasonSelectionCard", () => (
  <View style={{ margin: size(3) }}>
    <ReasonSelectionCard
      ids={["S1234567G"]}
      reasonSelectionHeader={"Indicate reason for dispute"}
      reasons={["Lost/stolen token", "Dead battery", "Damaged token"]}
      onCancel={() => undefined}
    />
  </View>
));
