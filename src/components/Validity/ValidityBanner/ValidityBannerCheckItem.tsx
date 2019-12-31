import React, { FunctionComponent } from "react";
import { View, Text } from "react-native";
import { ValidityIcon } from "../ValidityIcon";
import { getStatusProps } from "../utils";
import { CheckStatus } from "../constants";
import { size, fontSize } from "../../../common/styles";

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
        marginVertical: 3
      }}
    >
      <View style={{ marginRight: size(1) }}>
        <ValidityIcon checkStatus={checkStatus} size={size(1.5)} />
      </View>
      <Text
        style={{ color, fontSize: fontSize(-2) }}
        testID="validity-check-message"
      >
        {message}
      </Text>
    </View>
  );
};
