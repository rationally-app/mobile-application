import React, { FunctionComponent } from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  color,
  size,
  fontSize,
  letterSpacing,
  borderRadius
} from "../../common/styles";

export interface VerifiedLabel {
  isVerified?: boolean;
  lastVerification?: number;
}

export const VerifiedLabel: FunctionComponent<VerifiedLabel> = ({
  isVerified,
  lastVerification
}) => {
  let labelText;
  let iconName;
  let labelColor;
  let backgroundColor;
  switch (true) {
    case isVerified:
      labelText = "Verified";
      iconName = "check-circle";
      labelColor = color("green", 30);
      backgroundColor = color("green", 20);
      break;
    case !isVerified && !lastVerification:
      labelText = "Unknown";
      iconName = "alert-circle";
      labelColor = color("grey", 40);
      backgroundColor = color("grey", 10);
      break;
    default:
      labelText = "Invalid";
      iconName = "x-circle";
      labelColor = color("red", 30);
      backgroundColor = color("red", 20);
  }
  return (
    <View
      testID="verified-label"
      style={{
        backgroundColor,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: size(1.5),
        paddingVertical: size(1),
        borderRadius: borderRadius(1)
      }}
    >
      <Feather name={iconName} size={size(2)} style={{ color: labelColor }} />
      <Text
        style={{
          marginLeft: size(1),
          textTransform: "uppercase",
          letterSpacing: letterSpacing(1),
          fontWeight: "bold",
          fontSize: fontSize(-2),
          color: labelColor
        }}
      >
        {labelText}
      </Text>
    </View>
  );
};
