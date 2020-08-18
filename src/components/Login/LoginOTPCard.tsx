import React, {
  useState,
  useContext,
  useEffect,
  FunctionComponent
} from "react";
import { View, StyleSheet } from "react-native";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { size, fontSize } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { useAuthenticationContext } from "../../context/auth";
import {
  validateOTP,
  LoginError,
  LoginLockedOutError
} from "../../services/auth";
import { getEnvVersion, EnvVersionError } from "../../services/envVersion";
import { useProductContext } from "../../context/products";
import { Sentry } from "../../utils/errorTracking";
import {
  AlertModalContext,
  systemAlertProps,
  invalidEntryAlertProps,
  ERROR_MESSAGE
} from "../../context/alert";
import { LoginError } from "../../services/auth";

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

interface LoginOTPCard {
  resetStage: () => void;
  mobileNumber: string;
  codeKey: string;
  endpoint: string;
  handleRequestOTP: () => Promise<boolean>;
}

export const LoginOTPCard: FunctionComponent<LoginOTPCard> = ({
  resetStage,
  mobileNumber,
  codeKey,
  endpoint,
  handleRequestOTP
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [oTPValue, setOTPValue] = useState("");
  const [resendDisabledTime, setResendDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT
  );

  const { setAuthInfo } = useAuthenticationContext();
  const { showAlert } = useContext(AlertModalContext);
  const { setFeatures, setProducts, setAllProducts } = useProductContext();

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
      const versionResponse = await getEnvVersion(
        response.sessionToken,
        endpoint
      );
      setIsLoading(false);

      if (versionResponse.features.FLOW_TYPE) {
        setAuthInfo(response.sessionToken, response.ttl.getTime(), endpoint);
        setFeatures(versionResponse.features);
        setProducts(
          versionResponse.policies.filter(
            policy =>
              policy.categoryType === undefined ||
              policy.categoryType === "DEFAULT"
          )
        );
        setAllProducts(versionResponse.policies);
      } else {
        alert(
          "Invalid Environment Error: Make sure you scanned a valid QR code"
        );
        // Reset to initial login state
        resetStage();
      }
    } catch (e) {
      Sentry.captureException(e);
      if (e instanceof EnvVersionError) {
        showAlert({
          ...systemAlertProps,
          description: e.message
        });
      } else if (e instanceof LoginError) {
        showAlert({
          ...invalidEntryAlertProps,
          description: e.message
        });
      } else {
        showAlert({
          ...systemAlertProps,
          description: ERROR_MESSAGE.SERVER_ERROR
        });
      }
      setIsLoading(false);
    }
  };

  const onSubmitOTP = (): void => {
    onValidateOTP(oTPValue);
  };

  const resendOTP = async (): Promise<void> => {
    setIsResending(true);
    const isRequestSuccessful = await handleRequestOTP();
    setIsResending(false);
    if (isRequestSuccessful) setResendDisabledTime(RESEND_OTP_TIME_LIMIT);
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
              fullWidth={true}
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
