import React, { FunctionComponent } from "react";
import { TextProps, Text } from "react-native";
import { fontSize } from "../../common/styles";
import { useTheme } from "../../context/theme";

export const AppText: FunctionComponent<TextProps> = ({
  children,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        {
          fontFamily: "brand-regular",
          fontSize: fontSize(0),
          color: theme.appTextColor,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
