import React, { FunctionComponent, ReactNode } from "react";
import { color } from "../../../common/styles";
import { BaseButton } from "./BaseButton";
import { AppText } from "../AppText";

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
    backgroundColor="transparent"
    borderColor={color("blue", 50)}
    fullWidth={fullWidth}
  >
    <AppText
      style={{
        fontFamily: "inter-bold",
        textAlign: "center"
      }}
    >
      {text}
    </AppText>
  </BaseButton>
);
