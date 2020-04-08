import React, { FunctionComponent } from "react";
import { Transaction } from "../../services/quota";
import { differenceInSeconds, format, formatDistance } from "date-fns";
import { View } from "react-native";
import { CustomerCard } from "./CustomerCard";
import { AppText } from "../Layout/AppText";
import { color } from "../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { DarkButton } from "../Layout/Buttons/DarkButton";

const DURATION_THRESHOLD_SECONDS = 60 * 10; // 10 minutes

const DistantTransactionContent: FunctionComponent<{
  transactionTime: number;
}> = ({ transactionTime }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>Limit reached on </AppText>
    <AppText style={sharedStyles.statusTitle}>
      {format(transactionTime, "hh:mm a, do MMMM")}.
    </AppText>
  </>
);

const RecentTransactionContent: FunctionComponent<{
  now: Date;
  transactionTime: number;
}> = ({ now, transactionTime }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>Limit reached </AppText>
    <AppText style={sharedStyles.statusTitle}>
      {formatDistance(now, transactionTime)}
    </AppText>
    <AppText style={sharedStyles.statusTitle}> ago.</AppText>
  </>
);

const NoPreviousTransactionContent: FunctionComponent = () => (
  <AppText style={sharedStyles.statusTitle}>Limit reached.</AppText>
);

interface NoQuotaCard {
  nric: string;
  remainingQuota: Transaction[];
  onCancel: () => void;
}

/**
 * Shows when the user cannot purchase anything
 *
 * Precondition: Only rendered when remainingQuota are all 0
 */
export const NoQuotaCard: FunctionComponent<NoQuotaCard> = ({
  nric,
  remainingQuota,
  onCancel
}) => {
  const now = new Date();
  const secondsFromLastTransaction = remainingQuota[0]?.transactionTime
    ? differenceInSeconds(now, new Date(remainingQuota[0].transactionTime))
    : -1;
  return (
    <View>
      <CustomerCard nric={nric} headerBackgroundColor={color("red", 60)}>
        <View
          style={[
            sharedStyles.resultWrapper,
            sharedStyles.failureResultWrapper
          ]}
        >
          <AppText style={sharedStyles.emoji}>❌</AppText>
          <AppText style={sharedStyles.statusTitleWrapper}>
            {secondsFromLastTransaction > 0 ? (
              secondsFromLastTransaction > DURATION_THRESHOLD_SECONDS ? (
                <DistantTransactionContent
                  transactionTime={remainingQuota[0].transactionTime}
                />
              ) : (
                <RecentTransactionContent
                  now={now}
                  transactionTime={remainingQuota[0].transactionTime}
                />
              )
            ) : (
              <NoPreviousTransactionContent />
            )}
          </AppText>
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton text="Next customer" onPress={onCancel} fullWidth={true} />
      </View>
    </View>
  );
};
