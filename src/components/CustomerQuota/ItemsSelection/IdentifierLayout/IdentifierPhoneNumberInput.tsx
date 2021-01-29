import React, { FunctionComponent, useState, useEffect } from "react";
import {
  createFullNumber,
  parsePhoneNumber,
} from "../../../../utils/validatePhoneNumbers";
import { stripPhoneNumberFormatting } from "../../../../utils/phoneNumberFormatter";
import { View } from "react-native";
import { PhoneNumberInput } from "../../../Layout/PhoneNumberInput";
import { sharedStyles } from "./sharedStyles";
import { usePrevious } from "../../../../hooks/usePrevious";
import { size } from "../../../../common/styles";

export const IdentifierPhoneNumberInput: FunctionComponent<{
  addMarginRight: boolean;
  label: string;
  onPhoneNumberChange: (text: string) => void;
  value: string;
}> = ({ addMarginRight, label, onPhoneNumberChange, value }) => {
  const [countryCodeValue, setCountryCodeValue] = useState("+65");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullNumber, setFullNumber] = useState("");
  const prevFullNumber = usePrevious(fullNumber);

  useEffect(() => {
    setFullNumber(createFullNumber(countryCodeValue, phoneNumber));
  }, [countryCodeValue, phoneNumber]);

  useEffect(() => {
    onPhoneNumberChange(fullNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullNumber]);

  useEffect(() => {
    // value was updated from parent
    if (value.length > 0 && prevFullNumber && value !== prevFullNumber) {
      try {
        const parsedPhoneNumber = parsePhoneNumber(value);
        setCountryCodeValue(`+${parsedPhoneNumber.getCountryCodeOrDefault()}`);
        setPhoneNumber(`${parsedPhoneNumber.getNationalNumberOrDefault()}`);
      } catch (e) {
        setPhoneNumber(stripPhoneNumberFormatting(value));
      }
    }
  }, [value, prevFullNumber, countryCodeValue]);

  return (
    <View
      style={[
        sharedStyles.inputWrapper,
        ...(addMarginRight ? [{ marginRight: size(1) }] : []),
      ]}
    >
      <PhoneNumberInput
        countryCodeValue={countryCodeValue}
        label={label}
        mobileNumberValue={phoneNumber}
        onChangeCountryCode={setCountryCodeValue}
        onChangeMobileNumber={setPhoneNumber}
        accessibilityLabel="item-field-phone-number"
      />
    </View>
  );
};
