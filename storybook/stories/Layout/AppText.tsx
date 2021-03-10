import React from "react";
import { storiesOf } from "@storybook/react-native";
import { AppText } from "../../../src/components/Layout/AppText";
import { View, Text } from "react-native";
import { size, color } from "../../../src/common/styles";

const appTextElement = (): JSX.Element[] => {
  return [
    <>
      <AppText>
        <Text>Default app text</Text>
      </AppText>
    </>,
    <>
      <AppText style={{ color: color("red", 60) }}>
        <Text>customize app text in (color("red", 60))</Text>
      </AppText>
    </>,
    <>
      <AppText style={{ fontSize: size(3) }}>
        <Text>customize app text in fontSize: size(3)</Text>
      </AppText>
    </>,
  ];
};

storiesOf("Layout", module).add("AppText", () => (
  <View style={{ margin: size(3) }}>
    {appTextElement().map((appTextElement, index) => (
      <View key={index} style={{ marginBottom: size(1) }}>
        {appTextElement}
      </View>
    ))}
  </View>
));
