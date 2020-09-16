import React, { FunctionComponent } from "react";
import { format, formatDistance } from "date-fns";
import { AppText } from "../../Layout/AppText";
import { sharedStyles } from "../sharedStyles";
import i18n from "i18n-js";

export const DistantTransactionTitle: FunctionComponent<{
  transactionTime: Date;
  toggleTimeSensitiveTitle: boolean;
}> = ({ transactionTime, toggleTimeSensitiveTitle }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>
      {i18n.t("checkoutSuccessScreen.limitReached", {
        dateTime: format(transactionTime, "d MMM yyyy, h:mma")
      })}
    </AppText>
    {toggleTimeSensitiveTitle ? (
      <AppText style={sharedStyles.statusTitle}>
        {i18n.t("checkoutSuccessScreen.today")}
      </AppText>
    ) : (
      <AppText style={sharedStyles.statusTitle}>.</AppText>
    )}
  </>
);

export const RecentTransactionTitle: FunctionComponent<{
  now: Date;
  transactionTime: Date;
  toggleTimeSensitiveTitle: boolean;
}> = ({ now, transactionTime, toggleTimeSensitiveTitle }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>
      {i18n.t("checkoutSuccessScreen.limitReachedRecent", {
        time: formatDistance(now, transactionTime)
      })}
    </AppText>
    {toggleTimeSensitiveTitle ? (
      <AppText style={sharedStyles.statusTitle}>
        {i18n.t("checkoutSuccessScreen.today")}
      </AppText>
    ) : (
      <AppText style={sharedStyles.statusTitle}>.</AppText>
    )}
  </>
);

export const NoPreviousTransactionTitle: FunctionComponent<{
  toggleTimeSensitiveTitle: boolean;
}> = ({ toggleTimeSensitiveTitle }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>
      {i18n.t("checkoutSuccessScreen.limitReached")}
    </AppText>
    {toggleTimeSensitiveTitle ? (
      <AppText style={sharedStyles.statusTitle}>
        {i18n.t("checkoutSuccessScreen.today")}
      </AppText>
    ) : (
      <AppText style={sharedStyles.statusTitle}>.</AppText>
    )}
  </>
);

export const UsageQuotaTitle: FunctionComponent<{
  quantity: number;
  quotaRefreshTime: number;
}> = ({ quantity, quotaRefreshTime }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>
      {"\n"}
      {i18n.t("checkoutSuccessScreen.redeemedLimitReached", {
        quantity: quantity,
        dateTime: format(quotaRefreshTime, "d MMM yyyy")
      })}
    </AppText>
  </>
);
