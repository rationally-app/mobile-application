import React, { FunctionComponent } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

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
    <TouchableOpacity onPress={onPress} testID="base-button-2">
      <View
        style={{
          backgroundColor,
          alignSelf: "flex-start",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 5,
          minWidth: 80
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};
