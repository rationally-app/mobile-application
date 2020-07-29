import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { ReasonSelectionCard } from "../../../src/components/Appeal/ResonSelectionCard";

storiesOf("Dispute", module).add("ReasonDispute", () => (
  <View style={{ margin: size(3) }}>
    <ReasonSelectionCard
      reasonSelectionHeader={"Indicate reason for dispute"}
      reasons={["Lost/stolen token", "Dead battery", "Damaged token"]}
    />
  </View>
));
