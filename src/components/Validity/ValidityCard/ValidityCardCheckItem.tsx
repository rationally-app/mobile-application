import React, { FunctionComponent } from "react";
import { CheckStatus } from "../constants";
import { getStatusProps } from "../utils";
import { View, Text } from "react-native";
import { ValidityIcon } from "../ValidityIcon";
import { size, fontSize } from "../../../common/styles";

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
        marginBottom: size(2.5)
      }}
    >
      <View style={{ marginRight: size(2) }}>
        <ValidityIcon checkStatus={checkStatus} size={size(2.5)} />
      </View>
      <Text
        style={{ color, fontSize: fontSize(-1), flexShrink: 1 }}
        testID="validity-check-message"
      >
        {message}
      </Text>
    </View>
  );
};
