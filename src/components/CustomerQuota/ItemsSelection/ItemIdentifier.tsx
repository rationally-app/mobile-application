import React, { FunctionComponent, useState } from "react";
import { InputWithLabel } from "../../Layout/InputWithLabel";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { View, StyleSheet, Alert } from "react-native";
import { size, color } from "../../../common/styles";
import { Feather } from "@expo/vector-icons";
import { BarCodeScannedCallback } from "expo-barcode-scanner";
import { IdScannerModal } from "./IdScannerModal";

const styles = StyleSheet.create({
  inputAndButtonWrapper: {
    flexDirection: "row",
    alignItems: "flex-end"
  },
  inputWrapper: {
    flex: 1,
    marginRight: size(1)
  }
});

export const ItemIdentifier: FunctionComponent<{
  label: string;
}> = ({ label }) => {
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const [voucherCodeInput, setVoucherCodeInput] = useState("");

  const onCheck = async (input: string): Promise<void> => {
    try {
      setVoucherCodeInput(input);
      setShouldShowCamera(false);
    } catch (e) {
      setShouldShowCamera(false);
      Alert.alert("Error", e.message || e, [
        {
          text: "Dimiss"
        }
      ]);
    }
  };

  const onBarCodeScanned: BarCodeScannedCallback = event => {
    if (event.data) {
      onCheck(event.data);
    }
  };

  return (
    <>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <InputWithLabel
            label={label}
            value={voucherCodeInput}
            onChange={({ nativeEvent: { text } }) => setVoucherCodeInput(text)}
          />
        </View>

        <DarkButton
          text="Scan"
          icon={
            <Feather name="maximize" size={size(2)} color={color("grey", 0)} />
          }
          onPress={() => setShouldShowCamera(true)}
        />
      </View>
      {shouldShowCamera && (
        <IdScannerModal
          onBarCodeScanned={onBarCodeScanned}
          onCancel={() => setShouldShowCamera(false)}
          cancelButtonText="Enter Voucher manually"
          isVisible={shouldShowCamera}
        />
      )}
    </>
  );
};
