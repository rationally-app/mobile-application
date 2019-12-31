import React, { FunctionComponent } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { size, borderRadius } from "../../../common/styles";

export interface BaseButton {
  onPress?: () => void;
  backgroundColor?: ViewStyle["backgroundColor"];
}

export const BaseButton: FunctionComponent<BaseButton> = ({
  onPress,
  children,
  backgroundColor
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          backgroundColor,
          alignSelf: "flex-start",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: size(1.5),
          paddingHorizontal: size(3),
          borderRadius: borderRadius(3),
          height: size(5),
          minWidth: size(10)
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};
