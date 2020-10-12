import React, { FunctionComponent, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { size, color, borderRadius, fontSize } from "../../common/styles";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

const phoneNumberFormatted = (
  mobileNumberValue: string,
  region: string
): string => {
  try {
    return phoneUtil.format(
      phoneUtil.parse(mobileNumberValue, region),
      PhoneNumberFormat.NATIONAL
    );
  } catch (e) {
    return mobileNumberValue;
  }
};

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
    borderColor: color("blue", 50),
    fontSize: fontSize(0),
    color: color("blue", 50),
    minWidth: size(7),
    fontFamily: "brand-regular"
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
    fontFamily: "brand-regular"
  },
  hyphen: {
    marginRight: size(1),
    marginLeft: size(1),
    fontSize: fontSize(3)
  },
  numberWrapper: {
    marginBottom: size(2)
  },
  label: {
    fontFamily: "brand-bold"
  }
});

export const PhoneNumberInput: FunctionComponent<{
  countryCodeValue: string;
  label: string;
  mobileNumberValue: string;
  onChangeCountryCode: (text: string) => void;
  onChangeMobileNumber: (text: string) => void;
  onSubmit?: () => void;
}> = ({
  countryCodeValue,
  label,
  mobileNumberValue,
  onChangeCountryCode,
  onChangeMobileNumber,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSubmit = () => {}
}) => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onHandleChangeText = (text: string) => {
    setValue(text);
    const cleanText: string = text.replace(" ", "");
    onChangeMobileNumber(cleanText);
  };

  const [value, setValue] = useState<string>("");
  const formatValue: string = phoneNumberFormatted(
    value.replace(" ", ""),
    phoneUtil.getRegionCodeForCountryCode(
      Number(countryCodeValue.replace("+", ""))
    )
  );

  return (
    <View style={styles.numberWrapper}>
      <AppText style={styles.label}>{label}</AppText>
      <View style={styles.inputsWrapper}>
        <TextInput
          style={styles.countryCode}
          keyboardType="phone-pad"
          value={countryCodeValue}
          onChangeText={text => onChangeCountryCode(text)}
        />
        <AppText style={styles.hyphen}>-</AppText>
        <TextInput
          style={styles.numberInput}
          keyboardType="phone-pad"
          value={formatValue}
          onChangeText={text => onHandleChangeText(text)}
          onSubmitEditing={onSubmit}
        />
      </View>
    </View>
  );
};
