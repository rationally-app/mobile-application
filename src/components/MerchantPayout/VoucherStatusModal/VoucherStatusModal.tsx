import React, { FunctionComponent } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import { LoadingCard } from "./LoadingCard";
import { InvalidCard } from "./InvalidCard";
import { color, size } from "../../../common/styles";

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

type VoucherStatuses = "CHECKING" | "INVALID" | "VALID";

export interface VoucherStatus {
  status: VoucherStatuses;
  errorMessage?: string;
  errorTitle?: string;
}

interface VoucherStatusModal {
  voucherStatus: VoucherStatus;
  onExit: () => void;
}

export const VoucherStatusModal: FunctionComponent<VoucherStatusModal> = ({
  onExit,
  voucherStatus
}) => {
  const isVisible =
    voucherStatus.status === "INVALID" || voucherStatus.status === "CHECKING";

  let card;
  if (voucherStatus.status === "INVALID") {
    card = (
      <InvalidCard
        title={voucherStatus.errorTitle || "Invalid"}
        details={voucherStatus.errorMessage || "Please log an appeal request"}
        closeModal={onExit}
      />
    );
  } else {
    card = <LoadingCard />;
  }

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onExit}
      animationType="fade"
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={onExit}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
      <View style={styles.cardWrapper}>{card}</View>
    </Modal>
  );
};
