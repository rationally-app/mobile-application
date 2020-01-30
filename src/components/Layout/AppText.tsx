import React, { FunctionComponent } from "react";
import { TextProps, Text } from "react-native";
import { fontSize, color } from "../../common/styles";

export const AppText: FunctionComponent<TextProps> = ({
  children,
  style,
  ...props
}) => (
  <Text
    style={[
      {
        fontFamily: "inter",
        fontSize: fontSize(0),
        color: color("blue", 50)
      },
      style
    ]}
    {...props}
  >
    {children}
  </Text>
);
