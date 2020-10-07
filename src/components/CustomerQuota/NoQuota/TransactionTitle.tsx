import React, { FunctionComponent } from "react";
import { AppText } from "../../Layout/AppText";
import { sharedStyles } from "../sharedStyles";
import {
  formatDateTime,
  formatDate,
  formatTimeDifference
} from "../../../utils/dateTimeFormatter";
import { i18nString } from "../../../utils/i18nString";

export const DistantTransactionTitle: FunctionComponent<{
  transactionTime: Date;
  toggleTimeSensitiveTitle: boolean;
}> = ({ transactionTime, toggleTimeSensitiveTitle }) => {
  const today = toggleTimeSensitiveTitle
    ? `${i18nString("checkoutSuccessScreen", "today")}`
    : "";
  return (
    <>
      <AppText style={sharedStyles.statusTitle}>
        {i18nString("checkoutSuccessScreen", "limitReachedDate", {
          dateTime: formatDateTime(transactionTime),
          today
        })}
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
    ? `${i18nString("checkoutSuccessScreen", "today")}`
    : "";
  return (
    <>
      <AppText style={sharedStyles.statusTitle}>
        {`${i18nString("checkoutSuccessScreen", "limitReachedRecent", {
          time: formatTimeDifference(now, transactionTime),
          today
        })}`}
      </AppText>
    </>
  );
};

export const NoPreviousTransactionTitle: FunctionComponent<{
  toggleTimeSensitiveTitle: boolean;
}> = ({ toggleTimeSensitiveTitle }) => {
  const today = toggleTimeSensitiveTitle
    ? `${i18nString("checkoutSuccessScreen", "today")}`
    : "";
  return (
    <>
      <AppText style={sharedStyles.statusTitle}>
        {i18nString("checkoutSuccessScreen", "limitReached", {
          today
        })}
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
      {`${i18nString("checkoutSuccessScreen", "redeemedLimitReached", {
        quantity: quantity,
        date: formatDate(quotaRefreshTime)
      })}`}
    </AppText>
  </>
);
