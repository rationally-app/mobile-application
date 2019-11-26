import React, { FunctionComponent } from "react";
import { Text } from "react-native";
import { DARK, LIGHT } from "../../../common/colors";
import { BaseButton } from "./BaseButton";

export interface DarkButton {
  onPress?: () => void;
  text: string;
}

export const DarkButton: FunctionComponent<DarkButton> = ({
  onPress,
  text
}) => (
  <BaseButton onPress={onPress} backgroundColor={LIGHT}>
    <Text style={{ color: DARK, fontWeight: "bold" }}>{text}</Text>
  </BaseButton>
);
