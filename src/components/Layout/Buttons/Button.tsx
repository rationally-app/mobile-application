import React, { FunctionComponent } from "react";
import { Text } from "react-native";
import { DARK } from "../../../common/colors";
import { BaseButton } from "./BaseButton";

export interface Button {
  onPress?: () => void;
  text: string;
}

export const Button: FunctionComponent<Button> = ({ onPress, text }) => (
  <BaseButton onPress={onPress}>
    <Text style={{ color: DARK, fontWeight: "bold" }}>{text}</Text>
  </BaseButton>
);
