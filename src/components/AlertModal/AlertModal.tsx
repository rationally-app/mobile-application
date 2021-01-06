import React, { FunctionComponent } from "react";
import { Modal, StyleSheet, View } from "react-native";
import AlertIcon from "../../../assets/icons/alert.svg";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { DangerButton } from "../Layout/Buttons/DangerButton";
import {
  borderRadius,
  color,
  fontSize,
  shadow,
  size,
  normalize,
} from "../../common/styles";
import { AppText } from "../Layout/AppText";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: size(4),
  },
  modalView: {
    alignItems: "center",
    padding: size(3),
    width: "100%",
    maxWidth: 320,
    backgroundColor: "white",
    borderRadius: borderRadius(3),
    ...shadow(1),
  },
  alertIcon: {
    marginBottom: size(1.5),
  },
  modalTitle: {
    fontFamily: "brand-bold",
    fontSize: normalize(fontSize(2)),
    color: color("grey", 80),
    textAlign: "center",
  },
  modalDescription: {
    marginTop: size(1),
    textAlign: "center",
  },
  modalButtonRow: {
    marginTop: size(5),
    flexDirection: "column",
    alignSelf: "stretch",
    marginBottom: size(1),
    marginLeft: size(1),
  },
  modalSecondaryButton: {
    marginRight: size(1),
    flexGrow: 1,
    marginBottom: size(1),
  },
  modalPrimaryButton: {
    flexGrow: 1,
    marginRight: size(1),
    marginBottom: size(1),
  },
});

export interface AlertModalProps {
  alertType: "ERROR" | "WARN" | "CONFIRM" | "INFO";
  title: string;
  description?: string;
  buttonTexts: {
    primaryActionText: string;
    /**
     * Secondary button will be shown if this is defined
     */
    secondaryActionText?: string;
  };
  visible: boolean;
  onOk: () => void;
  onCancel?: () => void;
  /**
   * onExit is called before onOk and onCancel
   */
  onExit?: () => void;
}

export const AlertModal: FunctionComponent<AlertModalProps> = ({
  alertType,
  title,
  description,
  buttonTexts,
  visible,
  onOk,
  onCancel,
  onExit,
}) => {
  const PrimaryButton = alertType === "WARN" ? DangerButton : DarkButton;
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {alertType === "ERROR" && <AlertIcon style={styles.alertIcon} />}
          <AppText style={styles.modalTitle}>{title}</AppText>
          {description ? (
            <AppText style={styles.modalDescription}>{description}</AppText>
          ) : null}
          <View style={styles.modalButtonRow}>
            <View style={styles.modalPrimaryButton}>
              <PrimaryButton
                text={buttonTexts.primaryActionText}
                fullWidth={true}
                onPress={() => {
                  onExit?.();
                  onOk();
                }}
                accessibilityLabel="alert-modal-primary-button"
              />
            </View>

            {buttonTexts.secondaryActionText && (
              <View style={styles.modalSecondaryButton}>
                <SecondaryButton
                  text={buttonTexts.secondaryActionText}
                  fullWidth={true}
                  onPress={() => {
                    onExit?.();
                    onCancel?.();
                  }}
                  accessibilityLabel="alert-modal-secondary-button"
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
