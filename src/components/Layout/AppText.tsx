import React, { FunctionComponent } from "react";
import { TextProps, Text } from "react-native";
import { fontSize, color } from "../../common/styles";
import { lineHeight } from "../../common/styles/typography";

export const AppText: FunctionComponent<TextProps> = ({
  children,
  style,
  ...props
}) => (
  <Text
    style={[
      {
        fontFamily: "brand-regular",
        fontSize: fontSize(0),
        lineHeight: lineHeight(0, false),
        color: color("blue", 50),
      },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
);
