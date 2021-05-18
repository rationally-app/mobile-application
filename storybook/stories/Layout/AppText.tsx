import React from "react";
import { storiesOf } from "@storybook/react-native";
import { AppText } from "../../../src/components/Layout/AppText";
import { View } from "react-native";
import { size, color, fontSize } from "../../../src/common/styles";

const appTextElements: JSX.Element[] = [
  <AppText key="0">Default app text</AppText>,
  <AppText key="1" style={{ color: color("red", 60) }}>
    Customized text in red-60
  </AppText>,
  <AppText key="2" style={{ fontSize: fontSize(3) }}>
    customized text in fontSize-3
  </AppText>,
];

storiesOf("Layout", module).add("AppText", () => (
  <View style={{ margin: size(3) }}>
    {appTextElements.map((appTextElement, index) => (
      <View key={index} style={{ marginBottom: size(1) }}>
        {appTextElement}
      </View>
    ))}
  </View>
));
