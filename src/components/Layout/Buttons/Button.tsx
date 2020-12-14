import React, { FunctionComponent } from "react";
import { color, fontSize } from "../../../common/styles";
import { BaseButton } from "./BaseButton";
import { AppText } from "../AppText";

export interface Button {
  onPress?: () => void;
  text: string;
}

export const Button: FunctionComponent<Button> = ({ onPress, text }) => (
  <BaseButton onPress={onPress}>
    <AppText
      style={{
        color: color("grey", 80),
        fontFamily: "brand-bold",
        fontSize: fontSize(-2),
      }}
    >
      {text}
    </AppText>
  </BaseButton>
);
