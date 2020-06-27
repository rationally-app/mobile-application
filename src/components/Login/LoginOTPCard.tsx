import React, {
  useState,
  useEffect,
  FunctionComponent,
  useCallback
} from "react";
import { View, StyleSheet } from "react-native";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { size, fontSize } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { NavigationProps } from "../../types";
import { useAuthenticationContext } from "../../context/auth";
import { validateOTP, requestOTP } from "../../services/auth";
import { getEnvVersion, EnvVersionError } from "../../services/envVersion";
import { useProductContext } from "../../context/products";
import { useLogout } from "../../hooks/useLogout";

const RESEND_OTP_TIME_LIMIT = 30 * 1000;

const styles = StyleSheet.create({
  inputAndButtonWrapper: {
    marginTop: size(3)
  },
  buttonsWrapper: {
    marginTop: size(2),
    flexDirection: "row",
    alignItems: "center"
  },
  resendCountdownText: { marginRight: size(1), fontSize: fontSize(-2) },
  submitWrapper: {
    flex: 1,
    marginLeft: size(1)
  }
});

interface LoginOTPCard extends NavigationProps {
  mobileNumber: string;
  codeKey: string;
  endpoint: string;
}

export const LoginOTPCard: FunctionComponent<LoginOTPCard> = ({
  navigation,
  mobileNumber,
  codeKey,
  endpoint
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [oTPValue, setOTPValue] = useState("");
  const [resendDisabledTime, setResendDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT
  );
  const { setAuthInfo } = useAuthenticationContext();
  const { setFeatures, setProducts } = useProductContext();
  const { logout } = useLogout();

  const handleInvalidEnvLogout = useCallback((): void => {
    logout(navigation.dispatch, {
      title: "Invalid Environment",
      description: "Please check if this is a valid QR Code"
    });
  }, [logout, navigation.dispatch]);

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
      const response = await validateOTP(otp, mobileNumber, codeKey, endpoint);
      setIsLoading(false);
      setAuthInfo(response.sessionToken, response.ttl.getTime(), endpoint);

      const versionResponse = await getEnvVersion(
        response.sessionToken,
        endpoint
      );

      // Toggle between different environments
      // using the DIST_ENV variable from features

      // versionResponse.features.DIST_ENV

      if (versionResponse.features.DIST_ENV === "VOUCHER") {
        setFeatures(versionResponse.features);
        setProducts(versionResponse.policies);

        navigation.navigate("CollectCustomerDetailsScreen");
      } else {
        handleInvalidEnvLogout();
      }
    } catch (e) {
      if (e instanceof EnvVersionError) {
        alert(
          "Encountered an issue obtaining environment information. We've noted this down and are looking into it!"
        );
      } else {
        setIsLoading(false);
        alert(e);
      }
    }
  };

  const onSubmitOTP = (): void => {
    onValidateOTP(oTPValue);
  };

  const resendOTP = async (): Promise<void> => {
    setIsResending(true);
    try {
      await requestOTP(mobileNumber, codeKey, endpoint);
      setIsResending(false);
      setResendDisabledTime(RESEND_OTP_TIME_LIMIT);
    } catch (e) {
      setIsResending(false);
      alert(e.message || e);
    }
  };

  const handleChange = (text: string): void => {
    /^\d*$/.test(text) && setOTPValue(text);
  };

  return (
    <Card>
      <AppText>We&apos;re sending you the one-time password...</AppText>
      <View style={styles.inputAndButtonWrapper}>
        <InputWithLabel
          label="OTP"
          value={oTPValue}
          onChange={({ nativeEvent: { text } }) => handleChange(text)}
          onSubmitEditing={onSubmitOTP}
          keyboardType="numeric"
        />
        <View style={styles.buttonsWrapper}>
          {resendDisabledTime > 0 ? (
            <AppText style={styles.resendCountdownText}>
              Resend in {resendDisabledTime / 1000}s
            </AppText>
          ) : (
            <SecondaryButton
              text="Resend"
              onPress={resendOTP}
              isLoading={isResending}
              disabled={isLoading}
            />
          )}
          <View style={styles.submitWrapper}>
            <DarkButton
              text="Submit"
              fullWidth
              onPress={onSubmitOTP}
              isLoading={isLoading}
              disabled={isResending}
            />
          </View>
        </View>
      </View>
    </Card>
  );
};
