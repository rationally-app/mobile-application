import React from "react";
import { storiesOf } from "@storybook/react-native";
import { Card } from "../../../src/components/Layout/Card";
import { AppText } from "../../../src/components/Layout/AppText";
import { View } from "react-native";
import { size } from "../../../src/common/styles";

const cardElements: JSX.Element[] = [
  <Card key="0"></Card>,
  <Card key="1">
    <AppText>Card with text child element</AppText>
  </Card>,
];

storiesOf("Layout", module).add("Card", () => (
  <View style={{ margin: size(3) }}>
    {cardElements.map((cardElement, index) => (
      <View key={index} style={{ marginBottom: size(1) }}>
        {cardElement}
      </View>
    ))}
  </View>
));
