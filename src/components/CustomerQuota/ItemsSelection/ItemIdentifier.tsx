import React, { FunctionComponent, useState } from "react";
import { InputWithLabel } from "../../Layout/InputWithLabel";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { View, StyleSheet, Alert, Modal } from "react-native";
import { size, color } from "../../../common/styles";
import { Feather } from "@expo/vector-icons";
import { BarCodeScannedCallback } from "expo-barcode-scanner";
import { IdScanner } from "../../IdScanner/IdScanner";
import { PolicyIdentifier, TextInputType } from "../../../types";
import { PhoneNumberInput } from "../../Layout/PhoneNumberInput";

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

const IdentifierPhoneNumberInput: FunctionComponent<{
  label: string;
  onPhoneNumberChange: (text: string) => void;
}> = ({ label, onPhoneNumberChange }) => {
  const [countryCodeValue, setCountryCodeValue] = useState("+65");
  const [mobileNumber, setMobileNumber] = useState("");

  const onChangeCountryCode = (text: string): void => {
    setCountryCodeValue(text);
    onPhoneNumberChange(text + mobileNumber);
  };

  const onMobileNumberChange = (text: string): void => {
    setMobileNumber(text);
    onPhoneNumberChange(countryCodeValue + text);
  };

  return (
    <View style={[styles.inputWrapper]}>
      <PhoneNumberInput
        countryCodeValue={countryCodeValue}
        label={label}
        mobileNumberValue={mobileNumber}
        onChangeCountryCode={onChangeCountryCode}
        onChangeMobileNumber={onMobileNumberChange}
      />
    </View>
  );
};

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
    <InputWithLabel
      label={label}
      value={value}
      editable={editable}
      onChange={({ nativeEvent: { text } }) => onChange(text)}
      keyboardType={type === "NUMBER" ? "phone-pad" : "default"}
    />
  </View>
);

const IdentifierScanButton: FunctionComponent<{
  disabled: boolean;
  fullWidth: boolean;
  onPress: () => void;
  text: string | undefined;
}> = ({ disabled, fullWidth, onPress, text }) => (
  <View style={styles.buttonWrapper}>
    <DarkButton
      text={text || "Scan"}
      icon={<Feather name="maximize" size={size(2)} color={color("grey", 0)} />}
      disabled={disabled}
      fullWidth={fullWidth}
      onPress={onPress}
    />
  </View>
);

export const ItemIdentifier: FunctionComponent<{
  index: number;
  identifier: PolicyIdentifier;
  updateIdentifierValue: (index: number, value: string) => void;
}> = ({ index, identifier, updateIdentifierValue }) => {
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { label, textInput, scanButton } = identifier;

  const onCheck = async (input: string): Promise<void> => {
    try {
      setInputValue(input);
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
    setInputValue(input);
    updateIdentifierValue(index, input);
  };

  return (
    <>
      <View style={styles.inputAndButtonWrapper}>
        {textInput.visible &&
          (textInput.type === "PHONE_NUMBER" ? (
            <IdentifierPhoneNumberInput
              label={label}
              onPhoneNumberChange={onManualInput}
            />
          ) : (
            <IdentifierTextInput
              addMarginRight={scanButton.visible}
              editable={!textInput.disabled}
              label={label}
              onChange={onManualInput}
              type={textInput.type}
              value={inputValue}
            />
          ))}
        {scanButton.visible && (
          <IdentifierScanButton
            disabled={scanButton.disabled}
            fullWidth={!textInput.visible}
            onPress={() => setShouldShowCamera(true)}
            text={scanButton.text}
          />
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
            cancelButtonText={textInput.disabled ? "Back" : "Enter manually"}
          />
        </Modal>
      )}
    </>
  );
};
