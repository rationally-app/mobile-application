import React, { FunctionComponent } from "react";
import { View, StyleSheet, KeyboardType } from "react-native";
import { Feather } from "@expo/vector-icons";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { AppText } from "../Layout/AppText";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { size, color, fontSize } from "../../common/styles";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const styles = StyleSheet.create({
  scanButtonWrapper: {
    marginTop: size(3),
    marginBottom: size(6),
  },
  horizontalRule: {
    borderBottomColor: color("grey", 30),
    marginHorizontal: -size(3),
    borderBottomWidth: 1,
  },
  orWrapper: {
    position: "absolute",
    top: -fontSize(0),
    alignSelf: "center",
    backgroundColor: color("grey", 0),
    padding: size(1),
  },
  orText: {
    fontSize: fontSize(-1),
    fontFamily: "brand-bold",
  },
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
      <View style={styles.scanButtonWrapper}>
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
        <View style={styles.horizontalRule} />
        <View style={styles.orWrapper}>
          <AppText style={styles.orText}>
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
          />
        </View>
        <SecondaryButton
          text={i18nt("collectCustomerDetailsScreen", "check")}
          onPress={submitId}
        />
      </View>
    </>
  );
};
