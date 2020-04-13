import React, { FunctionComponent, ReactElement } from "react";
import { color, size } from "../../../common/styles";
import { BaseButton } from "./BaseButton";
import { AppText } from "../AppText";
import { ActivityIndicator, View } from "react-native";

export interface SecondaryButton {
  onPress?: () => void;
  text: string;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: ReactElement;
  disabled?: boolean;
}

export const SecondaryButton: FunctionComponent<SecondaryButton> = ({
  onPress,
  text,
  fullWidth = false,
  isLoading = false,
  icon,
  disabled
}) => (
  <BaseButton
    onPress={onPress}
    backgroundColor="transparent"
    borderColor={color("blue", disabled ? 20 : 50)}
    fullWidth={fullWidth}
    disabled={disabled || isLoading}
  >
    {isLoading ? (
      <ActivityIndicator size="small" color={color("grey", 40)} />
    ) : (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon && <View style={{ marginRight: size(1) }}>{icon}</View>}
        <AppText
          style={{
            color: color("blue", disabled ? 20 : 50),
            fontFamily: "brand-bold",
            textAlign: "center"
          }}
        >
          {text}
        </AppText>
      </View>
    )}
  </BaseButton>
);
