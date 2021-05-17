import React, { FunctionComponent, ReactElement } from "react";
import { color, size } from "../../../common/styles";
import { BaseButton } from "./BaseButton";
import { AppText } from "../AppText";
import { ActivityIndicator, View } from "react-native";

export interface DarkButton {
  onPress?: () => void;
  text?: string;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: ReactElement;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export const DarkButton: FunctionComponent<DarkButton> = ({
  onPress,
  text,
  fullWidth = false,
  isLoading = false,
  icon,
  disabled,
  accessibilityLabel,
}) => (
  <BaseButton
    onPress={onPress}
    borderColor={disabled ? color("grey", 40) : color("blue", 50)}
    backgroundColor={disabled ? color("grey", 40) : color("blue", 50)}
    fullWidth={fullWidth}
    disabled={disabled || isLoading}
    accessibilityLabel={accessibilityLabel}
  >
    {isLoading ? (
      <ActivityIndicator size="small" color={color("grey", 0)} />
    ) : (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon && (
          <View style={text ? { marginRight: size(1) } : {}}>{icon}</View>
        )}
        {text ? (
          <AppText
            style={{
              color: color("grey", 0),
              fontFamily: "brand-bold",
              textAlign: "center",
            }}
          >
            {text}
          </AppText>
        ) : null}
      </View>
    )}
  </BaseButton>
);
