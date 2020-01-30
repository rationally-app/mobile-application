import React, { FunctionComponent, ReactNode } from "react";
import { color, fontSize } from "../../../common/styles";
import { BaseButton } from "./BaseButton";
import { AppText } from "../AppText";

export interface DarkButton {
  onPress?: () => void;
  text: ReactNode;
  fullWidth?: boolean;
}

export const DarkButton: FunctionComponent<DarkButton> = ({
  onPress,
  text,
  fullWidth = false
}) => (
  <BaseButton
    onPress={onPress}
    backgroundColor={color("blue", 50)}
    fullWidth={fullWidth}
  >
    <AppText
      style={{
        color: color("grey", 0),
        fontFamily: "inter-bold"
      }}
    >
      {text}
    </AppText>
  </BaseButton>
);
