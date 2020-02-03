import React, { FunctionComponent, ReactNode } from "react";
import { color } from "../../../common/styles";
import { BaseButton } from "./BaseButton";
import { AppText } from "../AppText";
import { ActivityIndicator } from "react-native";

export interface DangerButton {
  onPress?: () => void;
  text: ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const DangerButton: FunctionComponent<DangerButton> = ({
  onPress,
  text,
  fullWidth = false,
  isLoading = false
}) => (
  <BaseButton
    onPress={onPress}
    backgroundColor={color("red", 50)}
    fullWidth={fullWidth}
    disabled={isLoading}
  >
    {isLoading ? (
      <ActivityIndicator size="small" color={color("grey", 0)} />
    ) : (
      <AppText
        style={{
          color: color("grey", 0),
          fontFamily: "inter-bold",
          textAlign: "center"
        }}
      >
        {text}
      </AppText>
    )}
  </BaseButton>
);
