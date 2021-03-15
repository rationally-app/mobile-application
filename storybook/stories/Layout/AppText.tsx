import React from "react";
import { storiesOf } from "@storybook/react-native";
import { AppText } from "../../../src/components/Layout/AppText";
import { View } from "react-native";
import { size, color } from "../../../src/common/styles";

const appTextElement: JSX.Element[] = [
  <AppText key="0">Default app text</AppText>,
  <AppText key="1" style={{ color: color("red", 60) }}>
    Customized text in red-60
  </AppText>,
  <AppText key="2" style={{ fontSize: size(3) }}>
    customized text in fontSize: size(3)
  </AppText>,
];

storiesOf("Layout", module).add("AppText", () => (
  <View style={{ margin: size(3) }}>
    {appTextElement.map((appTextElement, index) => (
      <View key={index} style={{ marginBottom: size(1) }}>
        {appTextElement}
      </View>
    ))}
  </View>
));
