import React from "react";
import { storiesOf } from "@storybook/react-native";
import { InputWithLabel } from "../../../src/components/Layout/InputWithLabel";
import { size } from "../../../src/common/styles";
import { View } from "react-native";

const inputWithLabelElements: JSX.Element[] = [
  <InputWithLabel key="0" label="Input with label" />,
  <InputWithLabel key="1" label="Not Editable Input" editable={false} />,
];

storiesOf("Layout", module).add("InputWithLabel", () => (
  <View style={{ marginHorizontal: size(3), marginVertical: size(4) }}>
    {inputWithLabelElements.map((inputWithLabelElement, index) => (
      <View key={index} style={{ marginBottom: size(1) }}>
        {inputWithLabelElement}
      </View>
    ))}
  </View>
));
