import React, { FunctionComponent } from "react";
import { View, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { InvalidCard } from "./InvalidCard";
import { color, size } from "../../../common/styles";
import {
  useCheckVoucherValidity,
  InvalidVoucherError,
  ScannerError,
} from "../../../hooks/useCheckVoucherValidity/useCheckVoucherValidity";
import { NotEligibleError } from "../../../services/quota";
import { AppText } from "../../Layout/AppText";
import { sharedStyles } from "./sharedStyles";
import { LimitReachedError } from "../../../utils/validateVoucherCode";
import {
  formatDateTime,
  formatTimeDifference,
} from "../../../utils/dateTimeFormatter";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";

const DURATION_THRESHOLD_SECONDS = 60 * 10; // 10 minutes

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color("grey", 90),
    opacity: 0.8,
  },
  cardWrapper: {
    padding: size(3),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

const DistantTransactionTitle: FunctionComponent<{
  transactionTime: Date;
}> = ({ transactionTime }) => {
  const { i18nt } = useTranslate();
  return (
    <>
      <AppText style={sharedStyles.statusTitle}>
        {i18nt("checkoutSuccessScreen", "redeemedOn", undefined, {
          time: formatDateTime(transactionTime),
        })}
      </AppText>
    </>
  );
};

const RecentTransactionTitle: FunctionComponent<{
  now: Date;
  transactionTime: Date;
}> = ({ now, transactionTime }) => {
  const { i18nt } = useTranslate();
  return (
    <>
      <AppText style={sharedStyles.statusTitle}>
        {i18nt("checkoutSuccessScreen", "redeemedAgo", undefined, {
          time: formatTimeDifference(now, transactionTime),
        })}
      </AppText>
    </>
  );
};

const NoPreviousTransactionTitle: FunctionComponent = () => {
  const { i18nt } = useTranslate();
  return (
    <AppText style={sharedStyles.statusTitle}>
      {i18nt("checkoutSuccessScreen", "previouslyRedeemed")}
    </AppText>
  );
};

interface VoucherStatusModal {
  checkValidityState: useCheckVoucherValidity["checkValidityState"];
  error?: useCheckVoucherValidity["error"];
  onExit: () => void;
}

export const VoucherStatusModal: FunctionComponent<VoucherStatusModal> = ({
  checkValidityState,
  error,
  onExit,
}) => {
  const isVisible = checkValidityState === "CHECKING_VALIDITY";

  let card;

  const { i18nt } = useTranslate();

  const title = i18nt("errorMessages", "notEligible", "title");
  const details = i18nt("errorMessages", "notEligible", "body");

  if (error instanceof ScannerError || error instanceof LimitReachedError) {
    return null;
  } else if (error instanceof NotEligibleError) {
    card = <InvalidCard title={title} details={details} closeModal={onExit} />;
  } else if (error instanceof InvalidVoucherError) {
    const secondsFromLatestTransaction = error.getSecondsFromLatestTransaction();
    const title =
      secondsFromLatestTransaction > 0 ? (
        secondsFromLatestTransaction > DURATION_THRESHOLD_SECONDS ? (
          <DistantTransactionTitle
            transactionTime={error.latestTransactionTime!}
          />
        ) : (
          <RecentTransactionTitle
            now={new Date()}
            transactionTime={error.latestTransactionTime!}
          />
        )
      ) : (
        <NoPreviousTransactionTitle />
      );
    card = <InvalidCard title={title} details={details} closeModal={onExit} />;
  } else if (error instanceof Error) {
    card = (
      <InvalidCard
        title={title}
        details={error.message || details}
        closeModal={onExit}
      />
    );
  } else {
    card = <ActivityIndicator size="large" color={color("grey", 0)} />;
  }

  return card ? (
    <Modal
      visible={isVisible}
      onRequestClose={error ? onExit : () => null}
      animationType="fade"
      transparent={true}
    >
      <View style={styles.background} />
      <View style={styles.cardWrapper}>{card}</View>
    </Modal>
  ) : null;
};
