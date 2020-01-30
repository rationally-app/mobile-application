import React, { FunctionComponent } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { size, borderRadius } from "../../../common/styles";

export interface BaseButton {
  onPress?: () => void;
  backgroundColor?: ViewStyle["backgroundColor"];
  borderColor?: ViewStyle["borderColor"];
  fullWidth?: boolean;
}

export const BaseButton: FunctionComponent<BaseButton> = ({
  onPress,
  children,
  backgroundColor,
  borderColor,
  fullWidth = false
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          backgroundColor,
          borderColor,
          borderWidth: borderColor ? 1 : 0,
          alignSelf: "flex-start",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: size(1.5),
          paddingHorizontal: size(3),
          borderRadius: borderRadius(2),
          height: size(6),
          minWidth: size(10),
          width: fullWidth ? "100%" : "auto"
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};
