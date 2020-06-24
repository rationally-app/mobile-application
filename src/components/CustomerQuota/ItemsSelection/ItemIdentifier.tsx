import React, { FunctionComponent, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { size } from "../../../common/styles";
import { PolicyIdentifier } from "../../../types";
import { IdentifierPhoneNumberInput } from "./IdentifierLayout/IdentifierPhoneNumberInput";
import { IdentifierTextInput } from "./IdentifierLayout/IdentifierTextInput";
import { IdentifierScanButton } from "./IdentifierLayout/IdentifierScanButton";
import { IdentifierScanModal } from "./IdentifierLayout/IdentifierScanModal";

const styles = StyleSheet.create({
  inputAndButtonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
    marginTop: size(2)
  },
  inputWrapper: {
    flex: 2
  },
  buttonWrapper: {
    flex: 1
  }
});

export const ItemIdentifier: FunctionComponent<{
  index: number;
  identifier: PolicyIdentifier;
  updateIdentifierValue: (index: number, value: string) => void;
}> = ({ index, identifier, updateIdentifierValue }) => {
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { label, textInput, scanButton } = identifier;

  const onScanInput = async (input: string): Promise<void> => {
    try {
      setInputValue(input);
      updateIdentifierValue(index, input);
      setShouldShowCamera(false);
    } catch (e) {
      setShouldShowCamera(false);
      Alert.alert("Error", e.message || e, [
        {
          text: "OK"
        }
      ]);
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
            text={scanButton.text || "Scan"}
          />
        )}
      </View>
      {shouldShowCamera && (
        <IdentifierScanModal
          cancelButtonText={textInput.disabled ? "Back" : "Enter manually"}
          setShouldShowCamera={setShouldShowCamera}
          shouldShowCamera={shouldShowCamera}
          onScanInput={onScanInput}
          type={scanButton.type || "BARCODE"}
        />
      )}
    </>
  );
};
