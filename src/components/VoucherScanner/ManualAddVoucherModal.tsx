import React, { FunctionComponent, useState } from "react";
import { StyleSheet, View } from "react-native";
import { size, color } from "../../common/styles";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { MaterialIcons } from "@expo/vector-icons";
import { ModalWithClose } from "../Layout/ModalWithClose";
import { i18nt } from "../../utils/translations";

const styles = StyleSheet.create({
  inputWrapper: {
    marginTop: size(1),
    marginBottom: size(2)
  }
});

interface ManualInputCard extends ModalWithClose {
  onVoucherCodeSubmit: (voucherCode: string) => void;
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
    <ModalWithClose isVisible={isVisible} onExit={onExit}>
      <View style={styles.inputWrapper}>
        <InputWithLabel
          label={i18nt("idScanner", "enterVoucherId")}
          value={voucherCode}
          onChange={({ nativeEvent: { text } }) => setVoucherCode(text)}
          onSubmitEditing={onSubmit}
        />
      </View>
      <DarkButton
        fullWidth={true}
        text={i18nt("merchantFlowScreen", "quotaButtonAddVoucher")}
        icon={
          <MaterialIcons name="add" size={size(2)} color={color("grey", 0)} />
        }
        onPress={onSubmit}
      />
    </ModalWithClose>
  );
};
