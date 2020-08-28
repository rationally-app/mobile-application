import React, { FunctionComponent } from "react";
import { format, formatDistance } from "date-fns";
import { AppText } from "../../Layout/AppText";
import { sharedStyles } from "../sharedStyles";

export const DistantTransactionTitle: FunctionComponent<{
  transactionTime: Date;
}> = ({ transactionTime }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>Limit reached on </AppText>
    <AppText style={sharedStyles.statusTitle}>
      {format(transactionTime, "d MMM yyyy, h:mma")}.
    </AppText>
  </>
);

export const RecentTransactionTitle: FunctionComponent<{
  now: Date;
  transactionTime: Date;
}> = ({ now, transactionTime }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>Limit reached </AppText>
    <AppText style={sharedStyles.statusTitle}>
      {formatDistance(now, transactionTime)}
    </AppText>
    <AppText style={sharedStyles.statusTitle}> ago.</AppText>
  </>
);

export const NoPreviousTransactionTitle: FunctionComponent = () => (
  <AppText style={sharedStyles.statusTitle}>Limit reached.</AppText>
);
