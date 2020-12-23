import React, { FunctionComponent, memo } from "react";
import { TextProps, Text } from "react-native";
import { fontSize, color } from "../../common/styles";

// eslint-disable-next-line react/display-name
export const AppText: FunctionComponent<TextProps> = memo(
  ({ children, style, ...props }) => (
    <Text
      style={[
        {
          fontFamily: "brand-regular",
          fontSize: fontSize(0),
          color: color("blue", 50),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  )
);
