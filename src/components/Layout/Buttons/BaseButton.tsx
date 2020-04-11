import React, { FunctionComponent } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { size, borderRadius } from "../../../common/styles";

export interface BaseButton {
  onPress?: () => void;
  backgroundColor?: ViewStyle["backgroundColor"];
  borderColor?: ViewStyle["borderColor"];
  disabled?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
}

export const BaseButton: FunctionComponent<BaseButton> = ({
  onPress,
  children,
  backgroundColor,
  borderColor,
  disabled = false,
  fullWidth = false,
  iconOnly
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
          paddingVertical: iconOnly ? size(1) : size(1.5),
          paddingHorizontal: iconOnly ? size(1) : size(3),
          borderRadius: borderRadius(2),
          minHeight: iconOnly ? size(1) : size(6),
          minWidth: iconOnly ? size(1) : size(10),
          width: fullWidth ? "100%" : "auto"
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};
