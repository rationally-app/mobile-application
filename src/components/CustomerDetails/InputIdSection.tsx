import React, { FunctionComponent } from "react";
import { View, StyleSheet, KeyboardType } from "react-native";
import { Feather } from "@expo/vector-icons";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { AppText } from "../Layout/AppText";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { size, color } from "../../common/styles";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { sharedStyles } from "./sharedStyles";

const styles = StyleSheet.create({
  inputAndButtonWrapper: {
    marginTop: size(5),
    flexDirection: "row",
    alignItems: "flex-end",
  },
  inputWrapper: {
    flex: 1,
    marginRight: size(1),
  },
});

interface InputIdSection {
  openCamera: () => void;
  idInput: string;
  setIdInput: (id: string) => void;
  submitId: () => void;
  keyboardType: KeyboardType;
}

export const InputIdSection: FunctionComponent<InputIdSection> = ({
  openCamera,
  idInput,
  setIdInput,
  submitId,
  keyboardType,
}) => {
  const { i18nt } = useTranslate();
  return (
    <>
      <View style={sharedStyles.scanButtonWrapper}>
        <DarkButton
          fullWidth={true}
          text={i18nt("collectCustomerDetailsScreen", "scanIdentification")}
          icon={
            <Feather name="maximize" size={size(2)} color={color("grey", 0)} />
          }
          onPress={openCamera}
        />
      </View>
      <View style={{ position: "relative" }}>
        <View style={sharedStyles.horizontalRule} />
        <View style={sharedStyles.orWrapper}>
          <AppText style={sharedStyles.orText}>
            {i18nt("collectCustomerDetailsScreen", "or")}
          </AppText>
        </View>
      </View>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <InputWithLabel
            label={i18nt("collectCustomerDetailsScreen", "enterIdNumber")}
            value={idInput}
            onChange={({ nativeEvent: { text } }) => setIdInput(text)}
            onSubmitEditing={submitId}
            autoCompleteType="off"
            autoCorrect={false}
            keyboardType={keyboardType}
            accessibilityLabel="identity-details"
          />
        </View>
        <SecondaryButton
          text={i18nt("collectCustomerDetailsScreen", "check")}
          onPress={submitId}
          accessibilityLabel="identity-details-check-button"
        />
      </View>
    </>
  );
};
