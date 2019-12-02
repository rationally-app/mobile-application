import React, { FunctionComponent, ReactNode } from "react";
import { View, Text } from "react-native";
import { ValidityIcon } from "./ValidityIcon";
import { CheckStatus } from "../../../constants/verifier";
import { GREEN_30, RED_30, DARK } from "../../../common/colors";

interface ValidityCheckItem {
  checkStatus: CheckStatus;
  messages: { [status in CheckStatus]: ReactNode };
}

export const ValidityCheckItem: FunctionComponent<ValidityCheckItem> = ({
  checkStatus,
  messages
}) => {
  let messageColor;
  switch (checkStatus) {
    case CheckStatus.VALID:
      messageColor = GREEN_30;
      break;
    case CheckStatus.INVALID:
      messageColor = RED_30;
      break;
    case CheckStatus.CHECKING:
    default:
      messageColor = DARK;
      break;
  }

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
      <Text
        style={{ color: messageColor, fontSize: 12 }}
        testID="validity-check-message"
      >
        {messages[checkStatus]}
      </Text>
    </View>
  );
};
