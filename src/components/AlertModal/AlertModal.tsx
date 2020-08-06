import React, { FunctionComponent } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import AlertIcon from "../../../assets/icons/alert.svg";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { DangerButton } from "../Layout/Buttons/DangerButton";
import {
  borderRadius,
  color,
  fontSize,
  shadow,
  size
} from "../../common/styles";
import { AppText } from "../Layout/AppText";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  modalView: {
    alignItems: "center",
    marginBottom: 0,
    paddingTop: size(3),
    width: 280,
    backgroundColor: "white",
    borderRadius: borderRadius(3),
    ...shadow(1)
  },
  alertIcon: {
    marginBottom: 9
  },
  modalTitle: {
    fontWeight: "bold",
    fontFamily: "brand-bold",
    fontSize: fontSize(2),
    color: color("blue", 50),
    textAlign: "center",
    marginHorizontal: 28,
    marginBottom: size(0.5)
  },
  modalText: {
    marginHorizontal: 32.5,
    marginBottom: size(4),
    textAlign: "center"
  },
  modalGroupButton: {
    flexDirection: "row",
    marginHorizontal: size(2),
    marginBottom: size(3)
  },
  modalSecondaryButton: {
    marginRight: size(1),
    flexShrink: 1
  },
  modalPrimaryButton: {
    flex: 1
  }
});
type AlertType = "ERROR" | "WARN" | "CONFIRM" | "INFO";
export type CallToActionKeyType = "YES_NO" | "OK_CANCEL" | "CONFIRM_CANCEL";
type CallToActionButtonTexts = {
  primaryActionText: string;
  secondaryActionText?: string;
};

const callToActionCollection: {
  [key in CallToActionKeyType]: CallToActionButtonTexts;
} = {
  YES_NO: { primaryActionText: "YES", secondaryActionText: "NO" },
  OK_CANCEL: { primaryActionText: "OK", secondaryActionText: "CANCEL" },
  CONFIRM_CANCEL: {
    primaryActionText: "CONFIRM",
    secondaryActionText: "CANCEL"
  }
};

export interface AlertModalProps {
  alertType: AlertType;
  title: string;
  description: string;
  buttonTextType: CallToActionKeyType;
  visible: boolean;
  onOk: () => void;
  onCancel?: () => void;
  onExit?: () => void;
}

export const AlertModal: FunctionComponent<AlertModalProps> = ({
  alertType,
  title,
  description,
  buttonTextType,
  visible,
  onOk,
  onCancel,
  onExit
}) => {
  let primaryButton: JSX.Element;
  switch (alertType) {
    case "WARN":
      primaryButton = (
        <DangerButton
          text={callToActionCollection[buttonTextType].primaryActionText}
          fullWidth={true}
          onPress={() => {
            onExit?.();
            onOk();
          }}
        />
      );
      break;
    default:
      primaryButton = (
        <DarkButton
          text={callToActionCollection[buttonTextType].primaryActionText}
          fullWidth={true}
          onPress={() => {
            onExit?.();
            onOk();
          }}
        />
      );
      break;
  }

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {alertType === "ERROR" && <AlertIcon style={styles.alertIcon} />}
          <Text style={styles.modalTitle}>{title}</Text>
          <AppText style={styles.modalText}>{description}</AppText>
          <View style={styles.modalGroupButton}>
            {alertType !== "ERROR" && alertType !== "INFO" && (
              <View style={styles.modalSecondaryButton}>
                <SecondaryButton
                  text={
                    callToActionCollection[buttonTextType]
                      .secondaryActionText || ""
                  }
                  fullWidth={true}
                  onPress={() => {
                    onExit?.();
                    onCancel?.();
                  }}
                />
              </View>
            )}
            <View style={styles.modalPrimaryButton}>{primaryButton}</View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
