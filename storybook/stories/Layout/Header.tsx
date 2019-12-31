import React from "react";
import { storiesOf } from "@storybook/react-native";
import { CenterDecorator } from "../decorators";

import { Text, View, TextStyle } from "react-native";
import { Header, RIGHT_OFFSET } from "../../../src/components/Layout/Header";

const mockBack = (): void => {
  alert("Back!");
};

const textStyle: TextStyle = {
  flex: 1,
  alignSelf: "center"
};

storiesOf("Layout", module)
  .addDecorator(CenterDecorator)
  .add("Header", () => (
    <View>
      <Header>
        <Text style={[textStyle, { textAlign: "center" }]}>
          Normal header without back
        </Text>
      </Header>
      <Header goBack={mockBack}>
        <Text style={textStyle}>Normal header with back</Text>
      </Header>
      <Header goBack={mockBack} hasBorder={false}>
        <Text style={textStyle}>Normal header with back, but no border</Text>
      </Header>
      <Header goBack={mockBack}>
        <Text
          style={[
            textStyle,
            {
              textAlign: "center",
              paddingRight: RIGHT_OFFSET
            }
          ]}
        >
          Hello World
        </Text>
      </Header>
    </View>
  ));
