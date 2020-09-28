import React, { FunctionComponent } from "react";
import {
  View,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert
} from "react-native";
import { InvalidCard } from "./InvalidCard";
import { color, size } from "../../../common/styles";
import {
  ScannerError,
  useCheckVoucherValidity,
  InvalidVoucherError
} from "../../../hooks/useCheckVoucherValidity/useCheckVoucherValidity";
import { NotEligibleError } from "../../../services/quota";
import { AppText } from "../../Layout/AppText";
import { sharedStyles } from "./sharedStyles";
import { LimitReachedError } from "../../../utils/validateVoucherCode";
import {
  formatDateTime,
  formatTimeDifference
} from "../../../utils/dateTimeFormatter";
import i18n from "i18n-js";

const DURATION_THRESHOLD_SECONDS = 60 * 10; // 10 minutes

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color("grey", 100),
    opacity: 0.8
  },
  cardWrapper: {
    padding: size(3),
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

const DistantTransactionTitle: FunctionComponent<{
  transactionTime: Date;
}> = ({ transactionTime }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>
      {i18n.t("checkoutSuccessScreen.redeemedOn", {
        time: formatDateTime(transactionTime)
      })}
    </AppText>
  </>
);

const RecentTransactionTitle: FunctionComponent<{
  now: Date;
  transactionTime: Date;
}> = ({ now, transactionTime }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>
      {i18n.t("checkoutSuccessScreen.redeemedAgo", {
        time: formatTimeDifference(now, transactionTime)
      })}
    </AppText>
  </>
);

const NoPreviousTransactionTitle: FunctionComponent = () => (
  <AppText style={sharedStyles.statusTitle}>
    {i18n.t("checkoutSuccessScreen.previouslyRedeemed")}
  </AppText>
);

const showAlert = (
  title: string,
  message: string,
  ctaText: string,
  onDismiss: () => void
): void =>
  Alert.alert(title, message, [{ text: ctaText, onPress: onDismiss }], {
    onDismiss: onDismiss // for android outside alert clicks
  });

interface VoucherStatusModal {
  checkValidityState: useCheckVoucherValidity["checkValidityState"];
  error?: useCheckVoucherValidity["error"];
  onExit: () => void;
}

export const VoucherStatusModal: FunctionComponent<VoucherStatusModal> = ({
  onExit,
  checkValidityState,
  error
}) => {
  const isVisible = checkValidityState === "CHECKING_VALIDITY";

  let card;

  const title = i18n.t(`errorMessages.notEligible.title`);
  const details = i18n.t(`errorMessages.notEligible.body`);

  if (error instanceof ScannerError) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        showAlert(
          i18n.t(`errorMessages.errorScanning.title`),
          error.message,
          i18n.t(`errorMessages.errorScanning.primaryActionText`),
          onExit
        );
      });
    });
    return null;
  } else if (error instanceof LimitReachedError) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        showAlert(
          i18n.t(`errorMessages.scanLimitReached.title`),
          error.message,
          i18n.t(`errorMessages.errorScanning.primaryActionText`),
          onExit
        );
      });
    });
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
