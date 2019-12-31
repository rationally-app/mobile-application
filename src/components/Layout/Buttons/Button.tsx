import React, { FunctionComponent } from "react";
import { Text } from "react-native";
import { color, fontSize } from "../../../common/styles";
import { BaseButton } from "./BaseButton";

export interface Button {
  onPress?: () => void;
  text: string;
}

export const Button: FunctionComponent<Button> = ({ onPress, text }) => (
  <BaseButton onPress={onPress}>
    <Text
      style={{
        color: color("grey", 40),
        fontWeight: "bold",
        fontSize: fontSize(-2)
      }}
    >
      {text}
    </Text>
  </BaseButton>
);
