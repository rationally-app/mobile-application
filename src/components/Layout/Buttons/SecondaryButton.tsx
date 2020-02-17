import React, { FunctionComponent } from "react";
import { color } from "../../../common/styles";
import { BaseButton } from "./BaseButton";
import { AppText } from "../AppText";
import { ActivityIndicator } from "react-native";

export interface SecondaryButton {
  onPress?: () => void;
  text: string;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const SecondaryButton: FunctionComponent<SecondaryButton> = ({
  onPress,
  text,
  fullWidth = false,
  isLoading = false
}) => (
  <BaseButton
    onPress={onPress}
    backgroundColor="transparent"
    borderColor={color("blue", 50)}
    fullWidth={fullWidth}
    disabled={isLoading}
  >
    {isLoading ? (
      <ActivityIndicator size="small" color={color("grey", 40)} />
    ) : (
      <AppText
        style={{
          fontFamily: "inter-bold",
          textAlign: "center"
        }}
      >
        {text}
      </AppText>
    )}
  </BaseButton>
);
