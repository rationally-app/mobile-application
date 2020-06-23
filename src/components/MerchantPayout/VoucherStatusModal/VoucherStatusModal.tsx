import React, { FunctionComponent } from "react";
import { View, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { InvalidCard } from "./InvalidCard";
import { color, size } from "../../../common/styles";
import {
  ScannerError,
  useCheckVoucherValidity
} from "../../../hooks/useCheckVoucherValidity";

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
    card = (
      <InvalidCard
        title={error.name}
        details={error.message}
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

  return (
    <Modal
      visible={isVisible}
      onRequestClose={error ? onExit : () => null}
      animationType="fade"
      transparent={true}
    >
      <View style={styles.background} />
      <View style={styles.cardWrapper}>{card}</View>
    </Modal>
  );
};
