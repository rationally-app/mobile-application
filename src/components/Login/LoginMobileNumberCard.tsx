import React, {
  useState,
  FunctionComponent,
  Dispatch,
  SetStateAction,
  useContext
} from "react";
import { View, StyleSheet } from "react-native";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { size } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { LoginStage } from "./types";
import { requestOTP } from "../../services/auth";
import { PhoneNumberInput } from "../Layout/PhoneNumberInput";
import {
  createFullNumber,
  countryCodeValidator,
  mobileNumberValidator
} from "../../utils/validatePhoneNumbers";
import {
  AlertModalContext,
  wrongFormatAlertProps,
  ERROR_MESSAGE
} from "../../context/alert";

const styles = StyleSheet.create({
  inputAndButtonWrapper: {
    marginTop: size(3)
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
  const { showAlert } = useContext(AlertModalContext);

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
      showAlert({
        ...wrongFormatAlertProps,
        description: ERROR_MESSAGE.INVALID_COUNTRY_CODE
      });
    } else if (!mobileNumberValidator(countryCode, mobileNumberValue)) {
      showAlert({
        ...wrongFormatAlertProps,
        description: ERROR_MESSAGE.INVALID_PHONE_NUMBER
      });
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
        <PhoneNumberInput
          countryCodeValue={countryCode}
          label="Mobile phone number"
          mobileNumberValue={mobileNumberValue}
          onChangeCountryCode={onChangeCountryCode}
          onChangeMobileNumber={onChangeMobileNumber}
          onSubmit={onSubmitMobileNumber}
        />

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
