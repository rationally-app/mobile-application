import React, { FunctionComponent, ReactElement } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import AlertLogo from "../../../assets/icons/alert.svg";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { DangerButton } from "../Layout/Buttons/DangerButton";

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
    borderRadius: 20,
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
    flex: 2,
    marginRight: 8
  },
  modalPrimaryButton: {
    flex: 3
  }
});
type AlertType = "ERROR" | "WARN" | "CONFIRM" | "INFO";

export interface AlertModalProp {
  alertType: AlertType;
  title: string;
  description: string;
  visible: boolean;
  onOk: () => void;
  onCancel?: () => void;
  onExit?: any;
}

export const AlertModal: FunctionComponent<AlertModalProp> = (
  props: AlertModalProp
) => {
  const getPrimaryButton = (alertType: AlertType): ReactElement => {
    switch (alertType) {
      case "WARN":
        return (
          <DangerButton
            text={"PREF. CTA"}
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
            text={"PREF. CTA"}
            fullWidth={true}
            onPress={() => {
              props.onExit();
              props.onCancel && props.onCancel();
            }}
          />
        );
    }
  };

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
                  text={"CTA"}
                  fullWidth={true}
                  onPress={() => {
                    props.onExit();
                    props.onCancel && props.onCancel();
                  }}
                />
              </View>
            )}
            <View style={styles.modalPrimaryButton}>
              {getPrimaryButton(props.alertType)}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
