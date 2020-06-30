import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ViewProps
} from "react-native";
import { size, color } from "../../common/styles";
import { Card } from "../Layout/Card";
import { Feather } from "@expo/vector-icons";

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
  },
  card: {
    width: 512,
    maxWidth: "100%"
  }
});

export interface ModalWithClose extends ViewProps {
  isVisible: boolean;
  onExit: () => void;
}

export const ModalWithClose: FunctionComponent<ModalWithClose> = ({
  isVisible,
  onExit,
  children,
  style
}) => {
  return (
    <Modal
      visible={isVisible}
      onRequestClose={onExit}
      animationType="none" // Setting an animation causes issues when there are other modals in the DOM
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={onExit}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
      <View style={styles.cardWrapper}>
        <Card style={[styles.card, style]}>
          <TouchableOpacity
            onPress={onExit}
            style={{
              position: "absolute",
              right: size(1.5),
              top: size(1.5),
              padding: size(1)
            }}
          >
            <Feather name="x" size={size(3)} color={color("blue", 50)} />
          </TouchableOpacity>
          {children}
        </Card>
      </View>
    </Modal>
  );
};
