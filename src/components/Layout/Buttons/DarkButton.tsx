import React, { FunctionComponent, ReactNode } from "react";
import { color } from "../../../common/styles";
import { BaseButton } from "./BaseButton";
import { AppText } from "../AppText";
import { ActivityIndicator } from "react-native";

export interface DarkButton {
  onPress?: () => void;
  text: ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const DarkButton: FunctionComponent<DarkButton> = ({
  onPress,
  text,
  fullWidth = false,
  isLoading = false
}) => (
  <BaseButton
    onPress={onPress}
    backgroundColor={color("blue", 50)}
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
