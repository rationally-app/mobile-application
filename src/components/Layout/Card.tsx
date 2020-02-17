import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { size, color, borderRadius, shadow } from "../../common/styles";

export const Card: FunctionComponent = ({ children }) => (
  <View
    style={{
      paddingTop: size(3),
      paddingBottom: size(4),
      paddingHorizontal: size(3),
      backgroundColor: color("grey", 0),
      borderRadius: borderRadius(4),
      ...shadow(2)
    }}
  >
    {children}
  </View>
);
