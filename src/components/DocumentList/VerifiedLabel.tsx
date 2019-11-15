import React, { FunctionComponent } from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LIGHT, LIGHT_RED_TINGE } from "../../common/colors";

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
  let backgroundColor;
  switch (true) {
    case isVerified:
      labelText = "VERIFIED";
      iconName = "check-circle";
      backgroundColor = LIGHT;
      break;
    case !isVerified && !lastVerification:
      labelText = "UNKNOWN";
      iconName = "alert-circle";
      backgroundColor = LIGHT_RED_TINGE;
      break;
    default:
      labelText = "INVALID";
      iconName = "x-circle";
      backgroundColor = LIGHT_RED_TINGE;
  }
  return (
    <View
      testID="verified-label"
      style={{
        backgroundColor,
        flexDirection: "row",
        alignItems: "center",
        padding: 5
      }}
    >
      <Feather name={iconName} />
      <Text style={{ marginLeft: 5 }}>{labelText}</Text>
    </View>
  );
};
