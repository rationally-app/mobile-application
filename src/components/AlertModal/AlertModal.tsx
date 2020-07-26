import React, { FunctionComponent } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    marginBottom: 0,
    padding: 0,
    width: 200,
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
  modalCancelButton: {
    borderWidth: 1,
    borderColor: "red",
    marginVertical: 20,
    color: "black",
    textAlign: "center"
  }
});

export interface AlertModalProp {
  alertType: string;
  title: string;
  description: string;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  onExit?: any;
}

export const AlertModal: FunctionComponent<AlertModalProp> = (
  props: AlertModalProp
) => {
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
          <Text style={styles.modalTitle}>{props.title}</Text>
          <Text style={styles.modalText}>{props.description}</Text>
          <View style={styles.modalSeparator} />
          <View style={styles.modalGroupButton}>
            <TouchableHighlight
              style={styles.modalCancelButton}
              onPress={() => {
                props.onExit();
                props.onCancel();
              }}
            >
              <Text>CTA</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.modalCancelButton}
              onPress={() => {
                props.onExit();
                props.onOk();
              }}
            >
              <Text>Prefer CTA</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
};
