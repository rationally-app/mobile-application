import React from "react";
import { storiesOf } from "@storybook/react-native";
import { Card } from "../../../src/components/Layout/Card";
import { View, Text } from "react-native";
import { size } from "../../../src/common/styles";

const cardElements = (): JSX.Element[] => {
  return [
    <>
      <Card></Card>
    </>,
    <>
      <Card>
        <Text>Card with text child element</Text>
      </Card>
    </>,
  ];
};

storiesOf("Layout", module).add("Card", () => (
  <View style={{ margin: size(3) }}>
    {cardElements().map((cardElement, index) => (
      <View key={index} style={{ marginBottom: size(1) }}>
        {cardElement}
      </View>
    ))}
  </View>
));
