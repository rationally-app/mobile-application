import React, { FunctionComponent, useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import { size, color } from "../../common/styles";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { Card } from "../Layout/Card";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { MaterialIcons, Feather } from "@expo/vector-icons";

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
  },
  inputWrapper: {
    marginTop: size(4),
    marginBottom: size(2)
  }
});

interface ManualInputCard {
  isVisible: boolean;
  onVoucherCodeSubmit: (voucherCode: string) => void;
  onExit: () => void;
}

export const ManualAddVoucherModal: FunctionComponent<ManualInputCard> = ({
  isVisible,
  onExit,
  onVoucherCodeSubmit
}) => {
  const [voucherCode, setVoucherCode] = useState("");

  const onSubmit = (): void => {
    onVoucherCodeSubmit(voucherCode);
    setVoucherCode("");
    onExit();
  };

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
      <View style={styles.cardWrapper}>
        <Card style={styles.card}>
          <TouchableOpacity
            onPress={onExit}
            style={{
              position: "absolute",
              right: size(2),
              top: size(2),
              padding: size(1)
            }}
          >
            <Feather name="x" size={size(3)} color={color("blue", 50)} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <InputWithLabel
              label="Enter voucher ID"
              value={voucherCode}
              onChange={({ nativeEvent: { text } }) => setVoucherCode(text)}
              onSubmitEditing={onSubmit}
            />
          </View>
          <DarkButton
            fullWidth
            text="Add voucher"
            icon={
              <MaterialIcons
                name="add"
                size={size(2)}
                color={color("grey", 0)}
              />
            }
            onPress={onSubmit}
          />
        </Card>
      </View>
    </Modal>
  );
};
