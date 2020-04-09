import React, { useState, useEffect, FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { size } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { NavigationProps } from "../../types";
import { useAuthenticationContext } from "../../context/auth";
import { validateOTP } from "../../services/auth";
import { useConfigContext } from "../../context/config";

const RESEND_OTP_TIME_LIMIT = 30 * 1000;

const styles = StyleSheet.create({
  inputAndButtonWrapper: {
    marginTop: size(3),
  },
  buttonsWrapper: {
    marginTop: size(2),
    flexDirection: "row",
    alignItems: "center",
  },
  submitWrapper: {
    flex: 1,
    marginLeft: size(1),
  },
});

interface LoginOTPCard extends NavigationProps {
  mobileNumber: string;
}

export const LoginOTPCard: FunctionComponent<LoginOTPCard> = ({
  navigation,
  mobileNumber,
}: LoginOTPCard) => {
  const [isLoading, setIsLoading] = useState(false);
  const [oTPValue, setOTPValue] = useState("");
  const [resendDisabledTime, setResendDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT
  );
  const { authKey, endpoint } = useAuthenticationContext();
  const { setConfigValue } = useConfigContext();

  useEffect(() => {
    const resendTimer = setTimeout(() => {
      if (resendDisabledTime <= 0) {
        clearTimeout(resendTimer);
      } else {
        setResendDisabledTime(resendDisabledTime - 1000);
      }
    }, 1000);

    return () => {
      if (resendTimer) {
        clearTimeout(resendTimer);
      }
    };
  }, [resendDisabledTime]);

  const onValidateOTP = async (otp: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await validateOTP(otp, mobileNumber, authKey, endpoint);
      setIsLoading(false);
      setConfigValue("session", response.session);
      navigation.navigate("CollectCustomerDetailsScreen");
    } catch (e) {
      alert(e.message || e);
    }
  };

  const onSubmitOTP = (): void => {
    onValidateOTP(oTPValue);
  };

  const resendOTP = (): void => {
    setResendDisabledTime(RESEND_OTP_TIME_LIMIT);
  };

  return (
    <Card>
      <AppText>We&apos;re sending you the one-time password...</AppText>
      <View style={styles.inputAndButtonWrapper}>
        <InputWithLabel
          label="OTP"
          value={oTPValue}
          onChange={({ nativeEvent: { text } }) => setOTPValue(text)}
          onSubmitEditing={onSubmitOTP}
        />
        <View style={styles.buttonsWrapper}>
          {resendDisabledTime > 0 ? (
            <AppText>Resend in {resendDisabledTime / 1000}s</AppText>
          ) : (
            <SecondaryButton text="Resend" onPress={resendOTP} />
          )}
          <View style={styles.submitWrapper}>
            <DarkButton
              text="Submit"
              fullWidth
              onPress={onSubmitOTP}
              isLoading={isLoading}
            />
          </View>
        </View>
      </View>
    </Card>
  );
};
