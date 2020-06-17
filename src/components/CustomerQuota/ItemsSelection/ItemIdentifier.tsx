import React, { FunctionComponent, useState } from "react";
import { InputWithLabel } from "../../Layout/InputWithLabel";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { View, StyleSheet, Alert, Modal } from "react-native";
import { size, color } from "../../../common/styles";
import { Feather } from "@expo/vector-icons";
import { BarCodeScannedCallback } from "expo-barcode-scanner";
import { IdScanner } from "../../IdScanner/IdScanner";
import { PolicyIdentifier, TextInputType } from "../../../types";

const styles = StyleSheet.create({
  inputAndButtonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%"
  },
  inputWrapper: {
    flex: 2
  },
  buttonWrapper: {
    flex: 1
  }
});

const IdentifierTextInput: FunctionComponent<{
  addMarginRight: boolean;
  editable: boolean;
  label: string;
  onChange: (text: string) => void;
  type: TextInputType | undefined;
  value: string;
}> = ({ addMarginRight, editable, label, onChange, type, value }) => (
  <View
    style={[
      styles.inputWrapper,
      ...(addMarginRight ? [{ marginRight: size(1) }] : [])
    ]}
  >
    {type === "PHONE_NUMBER" ? null : (
      <InputWithLabel
        label={label}
        value={value}
        editable={editable}
        onChange={({ nativeEvent: { text } }) => onChange(text)}
      />
    )}
  </View>
);

export const ItemIdentifier: FunctionComponent<{
  index: number;
  identifier: PolicyIdentifier;
  updateIdentifierValue: (index: number, value: string) => void;
}> = ({ index, identifier, updateIdentifierValue }) => {
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const [voucherCodeInput, setVoucherCodeInput] = useState("");

  const { label, textInput, scanButton } = identifier;

  const onCheck = async (input: string): Promise<void> => {
    try {
      setVoucherCodeInput(input);
      updateIdentifierValue(index, input);
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

  const onManualInput = (input: string): void => {
    setVoucherCodeInput(input);
    updateIdentifierValue(index, input);
  };

  return (
    <>
      <View style={styles.inputAndButtonWrapper}>
        {textInput.visible && (
          <IdentifierTextInput
            addMarginRight={!scanButton.visible}
            editable={!textInput.disabled}
            label={label}
            onChange={onManualInput}
            type={textInput.type}
            value={voucherCodeInput}
          />
        )}
        {scanButton.visible && (
          <View style={styles.buttonWrapper}>
            <DarkButton
              text={scanButton.text || "Scan"}
              icon={
                <Feather
                  name="maximize"
                  size={size(2)}
                  color={color("grey", 0)}
                />
              }
              disabled={scanButton.disabled}
              fullWidth={!textInput.visible}
              onPress={() => setShouldShowCamera(true)}
            />
          </View>
        )}
      </View>
      {shouldShowCamera && (
        <Modal
          visible={shouldShowCamera}
          onRequestClose={() => setShouldShowCamera(false)}
          transparent={true}
          animationType="slide"
        >
          <IdScanner
            onBarCodeScanned={onBarCodeScanned}
            onCancel={() => setShouldShowCamera(false)}
            cancelButtonText={
              textInput.disabled ? "Back" : "Enter manually" // TODO: check copy
            }
          />
        </Modal>
      )}
    </>
  );
};
