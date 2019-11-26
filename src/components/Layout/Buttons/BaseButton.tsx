import React, { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

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
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 5
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};
