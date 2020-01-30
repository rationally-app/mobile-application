import React, { FunctionComponent, ReactNode } from "react";
import { Text } from "react-native";
import { color, fontSize } from "../../../common/styles";
import { BaseButton } from "./BaseButton";

export interface SecondaryButton {
  onPress?: () => void;
  text: ReactNode;
  fullWidth?: boolean;
}

export const SecondaryButton: FunctionComponent<SecondaryButton> = ({
  onPress,
  text,
  fullWidth = false
}) => (
  <BaseButton
    onPress={onPress}
    backgroundColor={color("grey", 0)}
    borderColor={color("blue", 50)}
    fullWidth={fullWidth}
  >
    <Text
      style={{
        color: color("blue", 50),
        fontWeight: "bold",
        fontSize: fontSize(0)
      }}
    >
      {text}
    </Text>
  </BaseButton>
);
