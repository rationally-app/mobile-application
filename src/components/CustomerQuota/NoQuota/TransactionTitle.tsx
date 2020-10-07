import React, { FunctionComponent } from "react";
import { AppText } from "../../Layout/AppText";
import { sharedStyles } from "../sharedStyles";
import {
  formatDateTime,
  formatDate,
  formatTimeDifference
} from "../../../utils/dateTimeFormatter";
import { getTranslatedStringWithI18n } from "../../../utils/translations";

export const DistantTransactionTitle: FunctionComponent<{
  transactionTime: Date;
  toggleTimeSensitiveTitle: boolean;
}> = ({ transactionTime, toggleTimeSensitiveTitle }) => {
  const today = toggleTimeSensitiveTitle
    ? `${getTranslatedStringWithI18n("checkoutSuccessScreen", "today")}`
    : "";
  return (
    <>
      <AppText style={sharedStyles.statusTitle}>
        {getTranslatedStringWithI18n(
          "checkoutSuccessScreen",
          "limitReachedDate",
          undefined,
          {
            dateTime: formatDateTime(transactionTime),
            today
          }
        )}
      </AppText>
    </>
  );
};

export const RecentTransactionTitle: FunctionComponent<{
  now: Date;
  transactionTime: Date;
  toggleTimeSensitiveTitle: boolean;
}> = ({ now, transactionTime, toggleTimeSensitiveTitle }) => {
  const today = toggleTimeSensitiveTitle
    ? `${getTranslatedStringWithI18n("checkoutSuccessScreen", "today")}`
    : "";
  return (
    <>
      <AppText style={sharedStyles.statusTitle}>
        {`${getTranslatedStringWithI18n(
          "checkoutSuccessScreen",
          "limitReachedRecent",
          undefined,
          {
            time: formatTimeDifference(now, transactionTime),
            today
          }
        )}`}
      </AppText>
    </>
  );
};

export const NoPreviousTransactionTitle: FunctionComponent<{
  toggleTimeSensitiveTitle: boolean;
}> = ({ toggleTimeSensitiveTitle }) => {
  const today = toggleTimeSensitiveTitle
    ? `${getTranslatedStringWithI18n("checkoutSuccessScreen", "today")}`
    : "";
  return (
    <>
      <AppText style={sharedStyles.statusTitle}>
        {getTranslatedStringWithI18n(
          "checkoutSuccessScreen",
          "limitReached",
          undefined,
          {
            today
          }
        )}
      </AppText>
    </>
  );
};

export const UsageQuotaTitle: FunctionComponent<{
  quantity: number;
  quotaRefreshTime: number;
}> = ({ quantity, quotaRefreshTime }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>
      {"\n"}
      {`${getTranslatedStringWithI18n(
        "checkoutSuccessScreen",
        "redeemedLimitReached",
        undefined,
        {
          quantity: quantity,
          date: formatDate(quotaRefreshTime)
        }
      )}`}
    </AppText>
  </>
);
