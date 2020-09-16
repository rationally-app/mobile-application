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
import { formatDistance } from "date-fns";
import { sharedStyles } from "./sharedStyles";
import { LimitReachedError } from "../../../utils/validateVoucherCode";
import { formatDateTime } from "../../../utils/dateTimeFormatter";

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
    <AppText style={sharedStyles.statusTitle}>Redeemed on </AppText>
    <AppText style={sharedStyles.statusTitle}>
      {formatDateTime(transactionTime)}
    </AppText>
  </>
);

const RecentTransactionTitle: FunctionComponent<{
  now: Date;
  transactionTime: Date;
}> = ({ now, transactionTime }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>Redeemed </AppText>
    <AppText style={sharedStyles.statusTitle}>
      {formatDistance(now, transactionTime)}
    </AppText>
    <AppText style={sharedStyles.statusTitle}> ago</AppText>
  </>
);

const NoPreviousTransactionTitle: FunctionComponent = () => (
  <AppText style={sharedStyles.statusTitle}>Previously redeemed</AppText>
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
  if (error instanceof ScannerError) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        showAlert("Error scanning", error.message, "Continue scanning", onExit);
      });
    });
    return null;
  } else if (error instanceof LimitReachedError) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        showAlert("Scan limit reached", error.message, "OK", onExit);
      });
    });
  } else if (error instanceof NotEligibleError) {
    card = (
      <InvalidCard
        title="Invalid"
        details="Please log an appeal request"
        closeModal={onExit}
      />
    );
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
    card = (
      <InvalidCard
        title={title}
        details="Please log an appeal request"
        closeModal={onExit}
      />
    );
  } else if (error instanceof Error) {
    card = (
      <InvalidCard
        title="Invalid"
        details={error.message || "Please log an appeal request"}
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
