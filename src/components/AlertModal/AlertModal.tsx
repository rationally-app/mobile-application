import React, { FunctionComponent, useMemo } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import AlertLogo from "../../../assets/icons/alert.svg";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { DangerButton } from "../Layout/Buttons/DangerButton";
import { size } from "../../common/styles";

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
    marginBottom: 0,
    paddingTop: 24,
    width: 280,
    backgroundColor: "white",
    borderRadius: size(1),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  alertIcon: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 9
  },
  modalTitle: {
    fontWeight: "bold",
    fontFamily: "brand-bold",
    fontSize: 20,
    color: "#305367",
    textAlign: "center",
    marginHorizontal: 28,
    marginBottom: 4
  },
  modalText: {
    marginHorizontal: 32.5,
    marginBottom: 32,
    textAlign: "center",
    fontSize: 16,
    color: "#305367"
  },
  modalGroupButton: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 24
  },
  modalSecondaryBtm: {
    marginRight: 8,
    flexShrink: 1
  },
  modalPrimaryButton: {
    flex: 1
  }
});
type AlertType = "ERROR" | "WARN" | "CONFIRM" | "INFO";

// Add on the collection of action button texts
// try to declare object as { [key:string]: CallToActionButtonTexts }
// but somehow CallToActionKey unable to determine the keys on compile time
const callToActionCollection = Object.freeze({
  YES_NO: { primaryActionText: "YES", secondaryActionText: "NO" },
  OK_CANCEL: { primaryActionText: "OK", secondaryActionText: "CANCEL" },
  CONFIRM_CANCEL: {
    primaryActionText: "CONFIRM",
    secondaryActionText: "CANCEL"
  }
});

interface CallToActionButtonTexts {
  primaryActionText: string;
  secondaryActionText?: string;
}

export type CallToActionKey = keyof typeof callToActionCollection;

export interface AlertModalProp {
  alertType: AlertType;
  title: string;
  description: string;
  buttonTextType: CallToActionKey;
  visible: boolean;
  onOk: () => void;
  onCancel?: () => void;
  onExit?: any;
}

export const AlertModal: FunctionComponent<AlertModalProp> = (
  props: AlertModalProp
) => {
  const callToAction = useMemo(
    () =>
      callToActionCollection[props.buttonTextType] as CallToActionButtonTexts,
    [props.buttonTextType]
  );

  const primaryButton = useMemo(() => {
    switch (props.alertType) {
      case "WARN":
        return (
          <DangerButton
            text={callToAction.primaryActionText}
            fullWidth={true}
            onPress={() => {
              props.onExit();
              props.onCancel && props.onCancel();
            }}
          />
        );
      default:
        return (
          <DarkButton
            text={callToAction.primaryActionText}
            fullWidth={true}
            onPress={() => {
              props.onExit();
              props.onCancel && props.onCancel();
            }}
          />
        );
    }
  }, [callToAction.primaryActionText, props]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        console.warn("Modal has been closed.");
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {props.alertType === "ERROR" && (
            <AlertLogo style={styles.alertIcon} />
          )}
          <Text style={styles.modalTitle}>{props.title}</Text>
          <Text style={styles.modalText}>{props.description}</Text>
          <View style={styles.modalGroupButton}>
            {props.alertType !== "ERROR" && props.alertType !== "INFO" && (
              <View style={styles.modalSecondaryBtm}>
                <SecondaryButton
                  text={callToAction.secondaryActionText || ""}
                  fullWidth={true}
                  onPress={() => {
                    props.onExit();
                    props.onCancel && props.onCancel();
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
