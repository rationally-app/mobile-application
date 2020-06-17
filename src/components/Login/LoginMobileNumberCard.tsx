import React, {
  useState,
  FunctionComponent,
  Dispatch,
  SetStateAction
} from "react";
import { View, StyleSheet } from "react-native";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { size } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { LoginStage } from "./types";
import { requestOTP } from "../../services/auth";
import {
  mobileNumberValidator,
  countryCodeValidator,
  createFullNumber
} from "./utils";
import { PhoneNumberInput } from "../Layout/PhoneNumberInput";

const styles = StyleSheet.create({
  inputAndButtonWrapper: {
    marginTop: size(3)
  },
  numberWrapper: {
    marginBottom: size(2)
  },
  label: {
    fontFamily: "brand-bold"
  }
});

interface LoginMobileNumberCard {
  setLoginStage: Dispatch<SetStateAction<LoginStage>>;
  setMobileNumber: Dispatch<SetStateAction<string>>;
  codeKey: string;
  endpoint: string;
}

export const LoginMobileNumberCard: FunctionComponent<LoginMobileNumberCard> = ({
  setLoginStage,
  setMobileNumber,
  codeKey,
  endpoint
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+65");
  const [mobileNumberValue, setMobileNumberValue] = useState("");

  const onChangeCountryCode = (value: string): void => {
    if (value.length <= 4) {
      const valueWithPlusSign = value[0] === "+" ? value : `+${value}`;
      setCountryCode(valueWithPlusSign);
    }
  };

  const onChangeMobileNumber = (text: string): void => {
    /^\d*$/.test(text) && setMobileNumberValue(text);
  };

  const onRequestOTP = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const fullNumber = createFullNumber(countryCode, mobileNumberValue);
      await requestOTP(fullNumber, codeKey, endpoint);
      setIsLoading(false);
      setMobileNumber(fullNumber);
      setLoginStage("OTP");
    } catch (e) {
      setIsLoading(false);
      alert(e);
    }
  };

  const onSubmitMobileNumber = (): void => {
    if (!countryCodeValidator(countryCode)) {
      alert("Invalid country code");
    } else if (!mobileNumberValidator(countryCode, mobileNumberValue)) {
      alert("Invalid mobile phone number");
    } else {
      onRequestOTP();
    }
  };

  return (
    <Card>
      <AppText>
        Please enter your mobile phone number to receive a one-time password.
      </AppText>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.numberWrapper}>
          <AppText style={styles.label}>Mobile phone number</AppText>
          <PhoneNumberInput
            countryCodeValue={countryCode}
            mobileNumberValue={mobileNumberValue}
            onChangeCountryCode={onChangeCountryCode}
            onChangeMobileNumber={onChangeMobileNumber}
            onSubmit={onSubmitMobileNumber}
          />
        </View>

        <DarkButton
          text="Send OTP"
          onPress={onSubmitMobileNumber}
          fullWidth={true}
          isLoading={isLoading}
        />
      </View>
    </Card>
  );
};
