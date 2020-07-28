import React, { FunctionComponent } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import AlertLogo from "../../../assets/icons/alert.svg";

const styles = StyleSheet.create({
  alertIcon: {
    marginTop: 24,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  primaryBtnText: {
    color: "blue"
  },
  primaryBtnTextDes: {
    color: "red"
  },
  primaryBtnTextInfo: {
    color: "black"
  },
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  modalView: {
    marginBottom: 0,
    padding: 0,
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
  modalTitle: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  },
  modalText: {
    marginTop: 20,
    marginHorizontal: 5,
    textAlign: "center",
    color: "gray"
  },
  modalSeparator: {
    marginTop: 20,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    alignSelf: "stretch"
  },
  modalGroupButton: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  modalButton: {
    marginVertical: 20,
    color: "black",
    textAlign: "center"
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
  const getPrimaryBtnTextColor = (alertType: AlertType): { color: string } => {
    switch (alertType) {
      case "ERROR":
        return styles.primaryBtnText;
      case "WARN":
        return styles.primaryBtnTextDes;
      case "CONFIRM":
        return styles.primaryBtnText;
      default:
        return styles.primaryBtnTextInfo;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        console.warn("Modal has been closed.");
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {props.alertType === "ERROR" && (
            <AlertLogo
              style={styles.alertIcon}
              width={48}
              height={48}
              viewBox="0 0 300 300"
            />
          )}
          <Text style={styles.modalTitle}>{props.title}</Text>
          <Text style={styles.modalText}>{props.description}</Text>
          <View style={styles.modalSeparator} />
          <View style={styles.modalGroupButton}>
            {props.alertType !== "ERROR" &&
              props.alertType !== "INFO" && (
                <TouchableHighlight
                  style={styles.modalButton}
                  onPress={() => {
                    props.onExit();
                    props.onCancel && props.onCancel();
                  }}
                >
                  <Text>CTA</Text>
                </TouchableHighlight>
              )}
            <TouchableHighlight
              style={styles.modalButton}
              onPress={() => {
                props.onExit();
                props.onOk();
              }}
            >
              <Text style={getPrimaryBtnTextColor(props.alertType)}>
                Prefer CTA
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
};
