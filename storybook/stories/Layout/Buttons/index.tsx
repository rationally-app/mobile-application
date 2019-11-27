import React from "react";
import { storiesOf } from "@storybook/react-native";
import { CenterDecorator } from "../../decorators";

import { DarkButton } from "../../../../src/components/Layout/Buttons/DarkButton";

const onPress = (): void => {
  alert("Touched!");
};

storiesOf("Layout", module)
  .addDecorator(CenterDecorator)
  .add("Butttons/DarkButton", () => (
    <DarkButton text="Touch Me" onPress={onPress} />
  ));
