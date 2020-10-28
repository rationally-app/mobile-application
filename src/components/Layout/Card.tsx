import React, { FunctionComponent } from "react";
import { View, ViewProps } from "react-native";
import { size, color, borderRadius, shadow } from "../../common/styles";

export const Card: FunctionComponent<ViewProps> = ({ children, style }) => (
  <View
    style={[
      {
        paddingTop: size(3),
        paddingBottom: size(4),
        paddingHorizontal: size(3),
        backgroundColor: color("grey", 0),
        borderRadius: borderRadius(3),
        ...shadow(2),
      },
      style,
    ]}
  >
    {children}
  </View>
);
