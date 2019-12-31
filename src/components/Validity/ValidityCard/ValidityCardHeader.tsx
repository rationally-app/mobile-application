import React, { FunctionComponent } from "react";
import { getStatusProps } from "../utils";
import { View, Text } from "react-native";
import { ValidityIcon } from "../ValidityIcon";
import { CheckStatus } from "../constants";
import { size, fontSize, letterSpacing } from "../../../common/styles";

interface ValidityCardHeader {
  checkStatus: CheckStatus;
}

export const ValidityCardHeader: FunctionComponent<ValidityCardHeader> = ({
  checkStatus
}) => {
  const { label, color, backgroundColor } = getStatusProps(checkStatus, {
    [CheckStatus.VALID]: {
      label: "Valid"
    },
    [CheckStatus.INVALID]: {
      label: "Invalid"
    },
    [CheckStatus.CHECKING]: {
      label: "Verifying..."
    }
  });

  return (
    <View
      style={{
        backgroundColor,
        padding: size(4),
        alignItems: "center"
      }}
    >
      <ValidityIcon checkStatus={checkStatus} size={size(4)} />
      <Text
        style={{
          color,
          fontSize: fontSize(0),
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: letterSpacing(2),
          marginTop: size(1.5)
        }}
        testID="validity-header-label"
      >
        {label}
      </Text>
    </View>
  );
};
