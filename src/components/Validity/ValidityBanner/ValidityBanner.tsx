import React, { FunctionComponent, useState } from "react";
import { View } from "react-native";
import { ValidityBannerHeader } from "./ValidityBannerHeader";
import { ValidityBannerContent } from "./ValidityBannerContent";
import { ValidityCheckItem } from "./ValidityBannerCheckItem";
import { CheckStatus, CHECK_MESSAGES } from "../constants";

const calculateProgress: (...args: CheckStatus[]) => number = (...args) =>
  args.filter(check => check !== CheckStatus.CHECKING).length / args.length;

interface ValidityBanner {
  tamperedCheck: CheckStatus;
  issuedCheck: CheckStatus;
  revokedCheck: CheckStatus;
  issuerCheck: CheckStatus;
  overallValidity: CheckStatus;
  initialIsExpanded?: boolean;
}

export const ValidityBanner: FunctionComponent<ValidityBanner> = ({
  tamperedCheck,
  issuedCheck,
  revokedCheck,
  issuerCheck,
  overallValidity,
  initialIsExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);

  return (
    <View testID="validity-banner">
      <ValidityBannerHeader
        checkStatus={overallValidity}
        isExpanded={isExpanded}
        progress={calculateProgress(
          tamperedCheck,
          issuedCheck,
          revokedCheck,
          issuerCheck
        )}
        onPress={() => setIsExpanded(prev => !prev)}
      />
      <ValidityBannerContent
        checkStatus={overallValidity}
        isExpanded={isExpanded}
      >
        <ValidityCheckItem
          checkStatus={tamperedCheck}
          messages={CHECK_MESSAGES.TAMPERED_CHECK}
        />
        <ValidityCheckItem
          checkStatus={issuedCheck}
          messages={CHECK_MESSAGES.ISSUED_CHECK}
        />
        <ValidityCheckItem
          checkStatus={revokedCheck}
          messages={CHECK_MESSAGES.REVOKED_CHECK}
        />
        <ValidityCheckItem
          checkStatus={issuerCheck}
          messages={CHECK_MESSAGES.ISSUER_CHECK}
        />
      </ValidityBannerContent>
    </View>
  );
};
