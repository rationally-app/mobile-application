import React, { FunctionComponent } from "react";
import { format, formatDistance } from "date-fns";
import { AppText } from "../../Layout/AppText";
import { sharedStyles } from "../sharedStyles";

export const DistantTransactionTitle: FunctionComponent<{
  transactionTime: Date;
  toggleTimeSensitiveTitle: boolean;
}> = ({ transactionTime, toggleTimeSensitiveTitle }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>Limit reached on </AppText>
    <AppText style={sharedStyles.statusTitle}>
      {format(transactionTime, "d MMM yyyy, h:mma")}
    </AppText>
    {toggleTimeSensitiveTitle ? (
      <AppText style={sharedStyles.statusTitle}> for today.</AppText>
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
    <AppText style={sharedStyles.statusTitle}>Limit reached </AppText>
    <AppText style={sharedStyles.statusTitle}>
      {formatDistance(now, transactionTime)}
    </AppText>
    <AppText style={sharedStyles.statusTitle}> ago</AppText>
    {toggleTimeSensitiveTitle ? (
      <AppText style={sharedStyles.statusTitle}> for today.</AppText>
    ) : (
      <AppText style={sharedStyles.statusTitle}>.</AppText>
    )}
  </>
);

export const NoPreviousTransactionTitle: FunctionComponent<{
  toggleTimeSensitiveTitle: boolean;
}> = ({ toggleTimeSensitiveTitle }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>Limit reached</AppText>
    {toggleTimeSensitiveTitle ? (
      <AppText style={sharedStyles.statusTitle}> for today.</AppText>
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
      {quantity} item(s) more till {format(quotaRefreshTime, "d MMM yyyy")}.
    </AppText>
  </>
);
