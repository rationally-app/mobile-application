import React from "react";
import { storiesOf } from "@storybook/react-native";
import { DarkButton } from "../../../src/components/Layout/Buttons/DarkButton";
import { View } from "react-native";
import { size, color } from "../../../src/common/styles";
import { Feather } from "@expo/vector-icons";

storiesOf("Layout", module).add("DarkButton", () => (
  <View style={{ margin: size(3) }}>
    <DarkButton text="Checkout" />
    <DarkButton text="Checkout" isLoading={true} />
    <DarkButton
      text="Checkout"
      icon={
        <Feather name="shopping-cart" size={size(2)} color={color("grey", 0)} />
      }
    />
    <DarkButton
      text="Scan"
      icon={<Feather name="maximize" size={size(2)} color={color("grey", 0)} />}
    />
    <DarkButton text="Next customer" fullWidth={true} />
  </View>
));
