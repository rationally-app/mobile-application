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
import { ConfigContext } from "../../context/config";
import { PhoneNumberUtil } from "google-libphonenumber";

const styles = StyleSheet.create({
  inputAndButtonWrapper: {
    marginTop: size(3)
  }
});

interface LoginMobileNumberCard {
  setLoginStage: Dispatch<SetStateAction<LoginStage>>;
  setMobileNumber: Dispatch<SetStateAction<string>>;
  setCountryCode: Dispatch<SetStateAction<string>>;
  handleRequestOTP: (fullMobileNumber: string) => Promise<boolean>;
}

export const LoginMobileNumberCard: FunctionComponent<LoginMobileNumberCard> = ({
  setLoginStage,
  setMobileNumber,
  setCountryCode,
  handleRequestOTP
}) => {
  const { config } = useContext(ConfigContext);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCodeValue] = useState(
    config.fullMobileNumber?.countryCode ?? "+65"
  );
  const [mobileNumberValue, setMobileNumberValue] = useState(
    config.fullMobileNumber?.mobileNumber ?? ""
  );
  const { showAlert } = useContext(AlertModalContext);

  const onChangeCountryCode = (value: string): void => {
    if (value.length <= 4) {
      const valueWithPlusSign = value[0] === "+" ? value : `+${value}`;
      setCountryCodeValue(valueWithPlusSign);
    }
  };

  const onChangeMobileNumber = (text: string): void => {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const value: string =
      text.length > 2
        ? phoneUtil.formatOutOfCountryCallingNumber(
            phoneUtil.parseAndKeepRawInput(text, "SG"),
            "SG"
          )
        : text;
    ///^\d*$/.test(text) &&
    setMobileNumberValue(value);
  };

  const onRequestOTP = async (): Promise<void> => {
    setIsLoading(true);
    const fullMobileNumber = createFullNumber(countryCode, mobileNumberValue);
    const isRequestSuccessful = await handleRequestOTP(fullMobileNumber);
    setIsLoading(false);
    if (isRequestSuccessful) {
      setMobileNumber(mobileNumberValue);
      setCountryCode(countryCode);
      setLoginStage("OTP");
    }
  };

  const parsedMobileNumberValue = mobileNumberValue.replace(" ", "");

  const onSubmitMobileNumber = (): void => {
    if (!countryCodeValidator(countryCode)) {
      showAlert({
        ...wrongFormatAlertProps,
        description: ERROR_MESSAGE.INVALID_COUNTRY_CODE
      });
    } else if (!mobileNumberValidator(countryCode, parsedMobileNumberValue)) {
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
