import React, { FunctionComponent } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { size as sizeScale, borderRadius } from "../../../common/styles";

export interface BaseButton {
  onPress?: () => void;
  backgroundColor?: ViewStyle["backgroundColor"];
  borderColor?: ViewStyle["borderColor"];
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "medium" | "small";
}

export const BaseButton: FunctionComponent<BaseButton> = ({
  onPress,
  children,
  backgroundColor,
  borderColor,
  disabled = false,
  fullWidth = false,
  size = "medium",
}) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        style={{
          backgroundColor,
          borderColor,
          borderWidth: borderColor ? 1 : 0,
          alignSelf: "flex-start",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: size === "small" ? sizeScale(1) : sizeScale(1.5),
          paddingHorizontal: size === "small" ? sizeScale(2) : sizeScale(3),
          borderRadius: borderRadius(2),
          minHeight: size === "small" ? sizeScale(4) : sizeScale(6),
          minWidth: size === "small" ? sizeScale(6) : sizeScale(10),
          width: fullWidth ? "100%" : "auto",
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};
