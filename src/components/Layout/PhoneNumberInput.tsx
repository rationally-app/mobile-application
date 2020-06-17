import React, { FunctionComponent } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { size, color, borderRadius, fontSize } from "../../common/styles";

const styles = StyleSheet.create({
  inputsWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  countryCode: {
    minHeight: size(6),
    paddingHorizontal: size(1),
    marginTop: size(1),
    backgroundColor: color("grey", 0),
    borderWidth: 1,
    borderRadius: borderRadius(2),
    borderColor: color("grey", 40),
    fontSize: fontSize(0),
    color: color("blue", 50),
    minWidth: size(7)
  },
  numberInput: {
    flex: 1,
    minHeight: size(6),
    paddingHorizontal: size(1),
    marginTop: size(1),
    backgroundColor: color("grey", 0),
    borderWidth: 1,
    borderRadius: borderRadius(2),
    borderColor: color("grey", 40),
    fontSize: fontSize(0),
    color: color("blue", 50)
  },
  hyphen: {
    marginRight: size(1),
    marginLeft: size(1),
    fontSize: fontSize(3)
  }
});

export const PhoneNumberInput: FunctionComponent<{
  countryCodeValue: string;
  mobileNumberValue: string;
  onChangeCountryCode: (text: string) => void;
  onChangeMobileNumber: (text: string) => void;
  onSubmit: () => void;
}> = ({
  countryCodeValue,
  mobileNumberValue,
  onChangeCountryCode,
  onChangeMobileNumber,
  onSubmit
}) => {
  return (
    <View style={styles.inputsWrapper}>
      <TextInput
        style={styles.countryCode}
        keyboardType="phone-pad"
        value={countryCodeValue}
        onChange={({ nativeEvent: { text } }) => onChangeCountryCode(text)}
      />
      <AppText style={styles.hyphen}>-</AppText>
      <TextInput
        style={styles.numberInput}
        keyboardType="phone-pad"
        value={mobileNumberValue}
        onChange={({ nativeEvent: { text } }) => onChangeMobileNumber(text)}
        onSubmitEditing={onSubmit}
      />
    </View>
  );
};
