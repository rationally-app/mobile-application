import React, { FunctionComponent } from "react";
import { getStatusProps } from "../utils";
import { View } from "react-native";
import { ValidityCardHeader } from "./ValidityCardHeader";
import { ValidityCardCheckItem } from "./ValidityCardCheckItem";
import { CheckStatus, CHECK_MESSAGES } from "../constants";

interface ValidityCard {
  tamperedCheck: CheckStatus;
  issuedCheck: CheckStatus;
  revokedCheck: CheckStatus;
  issuerCheck: CheckStatus;
  overallValidity: CheckStatus;
}

export const ValidityCard: FunctionComponent<ValidityCard> = ({
  tamperedCheck,
  issuedCheck,
  revokedCheck,
  issuerCheck,
  overallValidity: checkStatus
}) => {
  const { backgroundColor } = getStatusProps(checkStatus);

  return (
    <View
      style={{
        maxWidth: "70%",
        borderWidth: 1,
        borderColor: backgroundColor,
        backgroundColor: "white",
        borderRadius: 8,
        overflow: "hidden"
      }}
    >
      <ValidityCardHeader checkStatus={checkStatus} />
      <View style={{ padding: 32, paddingBottom: 12 }}>
        <ValidityCardCheckItem
          checkStatus={tamperedCheck}
          messages={CHECK_MESSAGES.TAMPERED_CHECK}
        />
        <ValidityCardCheckItem
          checkStatus={issuedCheck}
          messages={CHECK_MESSAGES.ISSUED_CHECK}
        />
        <ValidityCardCheckItem
          checkStatus={revokedCheck}
          messages={CHECK_MESSAGES.REVOKED_CHECK}
        />
        <ValidityCardCheckItem
          checkStatus={issuerCheck}
          messages={CHECK_MESSAGES.ISSUER_CHECK}
        />
      </View>
    </View>
  );
};
