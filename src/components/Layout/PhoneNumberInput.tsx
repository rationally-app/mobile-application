import React, { FunctionComponent } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { size, color, borderRadius, fontSize } from "../../common/styles";
import {
  formatPhoneNumber,
  stripPhoneNumberFormatting,
} from "../../utils/phoneNumberFormatter";
import { lineHeight } from "../../common/styles/typography";

const styles = StyleSheet.create({
  inputsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryCode: {
    minHeight: size(6),
    paddingLeft: size(1.5),
    paddingRight: size(1.5),
    marginTop: size(1),
    backgroundColor: color("grey", 0),
    borderWidth: 1,
    borderRadius: borderRadius(2),
    borderColor: color("grey", 40),
    fontSize: fontSize(0),
    color: color("grey", 80),
    minWidth: size(7),
    fontFamily: "brand-regular",
  },
  numberInput: {
    flex: 1,
    minHeight: size(6),
    paddingLeft: size(1.5),
    paddingRight: size(1.5),
    marginTop: size(1),
    backgroundColor: color("grey", 0),
    borderWidth: 1,
    borderRadius: borderRadius(2),
    borderColor: color("grey", 40),
    fontSize: fontSize(0),
    color: color("grey", 80),
    fontFamily: "brand-regular",
  },
  hyphen: {
    marginRight: size(1),
    marginLeft: size(1),
    fontSize: fontSize(3),
    lineHeight: lineHeight(3),
  },
  numberWrapper: {
    paddingBottom: 32,
  },
  label: {
    fontFamily: "brand-bold",
  },
});

export const PhoneNumberInput: FunctionComponent<{
  countryCodeValue: string;
  label: string;
  mobileNumberValue: string;
  onChangeCountryCode: (text: string) => void;
  onChangeMobileNumber: (text: string) => void;
  onSubmit?: () => void;
  accessibilityLabel?: string;
}> = ({
  countryCodeValue,
  label,
  mobileNumberValue,
  onChangeCountryCode,
  onChangeMobileNumber,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSubmit = () => {},
  accessibilityLabel = "phone-number",
}) => {
  const countryCode = countryCodeValue.substr(1);
  return (
    <View style={styles.numberWrapper}>
      <AppText
        style={styles.label}
        accessibilityLabel={`${accessibilityLabel}-label`}
        testID={`${accessibilityLabel}-label`}
        accessible={true}
      >
        {label}
      </AppText>
      <View style={styles.inputsWrapper}>
        <TextInput
          style={styles.countryCode}
          keyboardType="phone-pad"
          value={countryCodeValue}
          onChangeText={(text) => onChangeCountryCode(text)}
        />
        <AppText style={styles.hyphen}>-</AppText>
        <TextInput
          style={styles.numberInput}
          keyboardType="phone-pad"
          value={formatPhoneNumber(mobileNumberValue, countryCode)}
          onChangeText={(text) => {
            onChangeMobileNumber(
              stripPhoneNumberFormatting(formatPhoneNumber(text, countryCode))
            );
          }}
          onSubmitEditing={onSubmit}
          accessibilityLabel={`${accessibilityLabel}-input`}
          testID={`${accessibilityLabel}-input`}
          accessible={true}
        />
      </View>
    </View>
  );
};
