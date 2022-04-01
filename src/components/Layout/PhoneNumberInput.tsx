import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { size, color, borderRadius, fontSize } from "../../common/styles";
import {
  formatPhoneNumber,
  stripPhoneNumberFormatting,
} from "../../utils/phoneNumberFormatter";

const styles = StyleSheet.create({
  inputsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryCode: {
    minHeight: size(6),
    paddingHorizontal: size(1),
    marginTop: size(1),
    backgroundColor: color("grey", 0),
    borderWidth: 1,
    borderRadius: borderRadius(2),
    borderColor: color("blue", 50),
    fontSize: fontSize(0),
    color: color("blue", 50),
    minWidth: size(7),
    fontFamily: "brand-regular",
  },
  numberInput: {
    flex: 1,
    minHeight: size(6),
    paddingHorizontal: size(1),
    marginTop: size(1),
    backgroundColor: color("grey", 0),
    borderWidth: 1,
    borderRadius: borderRadius(2),
    borderColor: color("blue", 50),
    fontSize: fontSize(0),
    color: color("blue", 50),
    fontFamily: "brand-regular",
  },
  hyphen: {
    marginHorizontal: size(0.5),
    fontSize: fontSize(3),
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
  const [formattedNumber, setFormattedNumber] = useState(mobileNumberValue);

  const onChangeNumberInput = useCallback(
    (text: string): void => {
      onChangeMobileNumber(stripPhoneNumberFormatting(text));
    },
    [onChangeMobileNumber]
  );

  useEffect(() => {
    const formatted = formatPhoneNumber(mobileNumberValue, countryCodeValue);
    setFormattedNumber(formatted);
    /**
     * Changes in country code may cause the format to be different and
     * the parent needs to be informed of the state change.
     * e.g. Initially country code is "+1", while number is "6588888888".
     * The input will show "658-888-8888". On changing country code to "+65",
     * the format updates to "8888 8888", but the parent's state is
     * still "6588888888". This ensures that the parent's state becomes
     * "88888888".
     */
    onChangeNumberInput(formatted);
  }, [countryCodeValue, mobileNumberValue, onChangeNumberInput]);

  return (
    <View>
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
          onChangeText={onChangeCountryCode}
          testID={"login-country-code-input"}
        />
        <AppText style={styles.hyphen}>-</AppText>
        <TextInput
          style={styles.numberInput}
          keyboardType="phone-pad"
          value={formattedNumber}
          onChangeText={onChangeNumberInput}
          onSubmitEditing={onSubmit}
          accessibilityLabel={`${accessibilityLabel}-input`}
          testID={`${accessibilityLabel}-input`}
          accessible={true}
        />
      </View>
    </View>
  );
};
