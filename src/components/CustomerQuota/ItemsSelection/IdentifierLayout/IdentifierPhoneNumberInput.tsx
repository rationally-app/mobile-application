import React, { FunctionComponent, useState, useEffect } from "react";
import { formatPhoneNumberE164 } from "../../../../utils/phoneNumbers";
import { View } from "react-native";
import { PhoneNumberInput } from "../../../Layout/PhoneNumberInput";
import { sharedStyles } from "./sharedStyles";

export const IdentifierPhoneNumberInput: FunctionComponent<{
  label: string;
  onPhoneNumberChange: (text: string) => void;
}> = ({ label, onPhoneNumberChange }) => {
  const [countryCodeValue, setCountryCodeValue] = useState("+65");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    onPhoneNumberChange(formatPhoneNumberE164(countryCodeValue, phoneNumber));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCodeValue, phoneNumber]);

  return (
    <View style={[sharedStyles.inputWrapper]}>
      <PhoneNumberInput
        countryCodeValue={countryCodeValue}
        label={label}
        mobileNumberValue={phoneNumber}
        onChangeCountryCode={(text: string) => setCountryCodeValue(text)}
        onChangeMobileNumber={(text: string) => setPhoneNumber(text)}
        accessibilityLabel="item-field-phone-number"
      />
    </View>
  );
};
