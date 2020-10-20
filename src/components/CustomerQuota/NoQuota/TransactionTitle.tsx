import React, { FunctionComponent } from "react";
import { AppText } from "../../Layout/AppText";
import { sharedStyles } from "../sharedStyles";
import {
  formatDateTime,
  formatDate,
  formatTimeDifference
} from "../../../utils/dateTimeFormatter";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";

export const DistantTransactionTitle: FunctionComponent<{
  transactionTime: Date;
  toggleTimeSensitiveTitle: boolean;
}> = ({ transactionTime, toggleTimeSensitiveTitle }) => {
  const { i18nt } = useTranslate();
  const today = toggleTimeSensitiveTitle
    ? `${i18nt("checkoutSuccessScreen", "today")}`
    : "";
  return (
    <>
      <AppText style={sharedStyles.statusTitle}>
        {i18nt("checkoutSuccessScreen", "limitReachedDate", undefined, {
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
  const { i18nt } = useTranslate();
  const today = toggleTimeSensitiveTitle
    ? `${i18nt("checkoutSuccessScreen", "today")}`
    : "";
  return (
    <>
      <AppText style={sharedStyles.statusTitle}>
        {`${i18nt("checkoutSuccessScreen", "limitReachedRecent", undefined, {
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
  const { i18nt } = useTranslate();
  const today = toggleTimeSensitiveTitle
    ? `${i18nt("checkoutSuccessScreen", "today")}`
    : "";
  return (
    <>
      <AppText style={sharedStyles.statusTitle}>
        {i18nt("checkoutSuccessScreen", "limitReached", undefined, {
          today
        })}
      </AppText>
    </>
  );
};

export const UsageQuotaTitle: FunctionComponent<{
  quantity: number;
  quotaRefreshTime: number;
}> = ({ quantity, quotaRefreshTime }) => {
  const { i18nt } = useTranslate();
  return (
    <>
      <AppText style={sharedStyles.statusTitle}>
        {"\n"}
        {`${i18nt("checkoutSuccessScreen", "redeemedLimitReached", undefined, {
          quantity: quantity,
          date: formatDate(quotaRefreshTime)
        })}`}
      </AppText>
    </>
  );
};
