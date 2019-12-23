import React, { FunctionComponent } from "react";
import { CheckStatus } from "../constants";
import { getStatusProps } from "../utils";
import { View, Text } from "react-native";
import { ValidityIcon } from "../ValidityIcon";

interface ValidityCardCheckItem {
  checkStatus: CheckStatus;
  messages: { [status in CheckStatus]: { message: string } };
}

export const ValidityCardCheckItem: FunctionComponent<ValidityCardCheckItem> = ({
  checkStatus,
  messages
}) => {
  const { color, message } = getStatusProps(checkStatus, messages);

  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 20
      }}
    >
      <View style={{ marginRight: 16 }}>
        <ValidityIcon checkStatus={checkStatus} size={20} />
      </View>
      <Text
        style={{ color, fontSize: 14, flexShrink: 1 }}
        testID="validity-check-message"
      >
        {message}
      </Text>
    </View>
  );
};
