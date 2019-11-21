import React from "react";
import { storiesOf } from "@storybook/react-native";
import { CenterDecorator } from "../decorators";

import { Text } from "react-native";
import { Header, RIGHT_OFFSET } from "../../../src/components/Layout/Header";

const mockBack = (): void => {
  alert("Back!");
};

storiesOf("Layout", module)
  .addDecorator(CenterDecorator)
  .add("Header", () => (
    <>
      <Header />
      <Header goBack={mockBack} />
      <Header goBack={mockBack}>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            paddingRight: RIGHT_OFFSET
          }}
        >
          Hello World
        </Text>
      </Header>
    </>
  ));
