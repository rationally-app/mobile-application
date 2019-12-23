import React, { FunctionComponent } from "react";
import { View, Text } from "react-native";
import { ValidityIcon } from "../ValidityIcon";
import { getStatusProps } from "../utils";
import { CheckStatus } from "../constants";

interface ValidityCheckItem {
  checkStatus: CheckStatus;
  messages: { [status in CheckStatus]: { message: string } };
}

export const ValidityCheckItem: FunctionComponent<ValidityCheckItem> = ({
  checkStatus,
  messages
}) => {
  const { color, message } = getStatusProps(checkStatus, messages);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 3,
        marginBottom: 3
      }}
    >
      <View style={{ marginRight: 8 }}>
        <ValidityIcon checkStatus={checkStatus} size={12} />
      </View>
      <Text style={{ color, fontSize: 12 }} testID="validity-check-message">
        {message}
      </Text>
    </View>
  );
};
