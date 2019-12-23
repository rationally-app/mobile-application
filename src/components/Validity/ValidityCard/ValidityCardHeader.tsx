import React, { FunctionComponent } from "react";
import { getStatusProps } from "../utils";
import { View, Text } from "react-native";
import { ValidityIcon } from "../ValidityIcon";
import { CheckStatus } from "../constants";

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
        padding: 32,
        alignItems: "center"
      }}
    >
      <ValidityIcon checkStatus={checkStatus} size={32} />
      <Text
        style={{
          color,
          fontSize: 16,
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: 0.7,
          marginTop: 12
        }}
        testID="validity-header-label"
      >
        {label}
      </Text>
    </View>
  );
};
