import React, {
  useState,
  FunctionComponent,
  Dispatch,
  SetStateAction,
  useContext,
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
  mobileNumberValidator,
} from "../../utils/validatePhoneNumbers";
import { AlertModalContext, ERROR_MESSAGE } from "../../context/alert";
import { ConfigContext } from "../../context/config";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { lineHeight } from "../../common/styles/typography";

const styles = StyleSheet.create({
  inputAndButtonWrapper: {
    marginTop: size(3),
  },
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
  handleRequestOTP,
}) => {
  const { config } = useContext(ConfigContext);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCodeValue] = useState(
    config.fullMobileNumber?.countryCode ?? "+65"
  );
  const [mobileNumberValue, setMobileNumberValue] = useState(
    config.fullMobileNumber?.mobileNumber ?? ""
  );
  const { showErrorAlert } = useContext(AlertModalContext);

  const onChangeCountryCode = (value: string): void => {
    if (value.length <= 4) {
      const valueWithPlusSign = value[0] === "+" ? value : `+${value}`;
      setCountryCodeValue(valueWithPlusSign);
    }
  };
  const onChangeMobileNumber = (text: string): void => {
    /^\d*$/.test(text) && setMobileNumberValue(text);
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

  const onSubmitMobileNumber = (): void => {
    if (!countryCodeValidator(countryCode)) {
      showErrorAlert(new Error(ERROR_MESSAGE.INVALID_COUNTRY_CODE));
    } else if (!mobileNumberValidator(countryCode, mobileNumberValue)) {
      showErrorAlert(new Error(ERROR_MESSAGE.INVALID_PHONE_NUMBER));
    } else {
      onRequestOTP();
    }
  };

  const { i18nt } = useTranslate();

  return (
    <Card>
      <AppText style={{ lineHeight: lineHeight(0, true) }}>
        {i18nt("loginMobileNumberCard", "enterMobileNumber")}
      </AppText>
      <View style={styles.inputAndButtonWrapper}>
        <PhoneNumberInput
          countryCodeValue={countryCode}
          label={i18nt("loginMobileNumberCard", "mobileNumber")}
          mobileNumberValue={mobileNumberValue}
          onChangeCountryCode={onChangeCountryCode}
          onChangeMobileNumber={onChangeMobileNumber}
          onSubmit={onSubmitMobileNumber}
          accessibilityLabel="login-phone-number"
        />

        <DarkButton
          text={i18nt("loginMobileNumberCard", "sendOtp")}
          onPress={onSubmitMobileNumber}
          fullWidth={true}
          isLoading={isLoading}
          accessibilityLabel="login-send-otp-button"
        />
      </View>
    </Card>
  );
};
