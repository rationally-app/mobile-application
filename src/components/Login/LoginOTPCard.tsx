import React, {
  useState,
  useContext,
  useEffect,
  FunctionComponent,
} from "react";
import { View, StyleSheet } from "react-native";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { size, fontSize } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { InputWithLabel } from "../Layout/InputWithLabel";
import {
  validateOTP,
  LoginError,
  OTPWrongError,
  OTPExpiredError,
  OTPEmptyError,
  LoginLockedError,
} from "../../services/auth";
import { Sentry } from "../../utils/errorTracking";
import { AlertModalContext } from "../../context/alert";
import { AuthStoreContext } from "../../context/authStore";
import { AuthCredentials } from "../../types";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

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
  resendCountdownText: { marginRight: size(1), fontSize: fontSize(-2) },
  submitWrapper: {
    flex: 1,
    marginLeft: size(1),
  },
});

interface LoginOTPCard {
  resetStage: () => void;
  fullMobileNumber: string;
  operatorToken: string;
  endpoint: string;
  handleRequestOTP: (fullMobileNumber: string) => Promise<boolean>;
  onSuccess: (credentials: AuthCredentials) => void;
}

export const LoginOTPCard: FunctionComponent<LoginOTPCard> = ({
  resetStage,
  fullMobileNumber,
  operatorToken,
  endpoint,
  handleRequestOTP,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [oTPValue, setOTPValue] = useState("");
  const [resendDisabledTime, setResendDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT
  );

  const { setAuthCredentials } = useContext(AuthStoreContext);
  const { showErrorAlert } = useContext(AlertModalContext);
  const setState = useState()[1];

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

  const { i18nt } = useTranslate();

  const onValidateOTP = async (otp: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await validateOTP(
        otp,
        fullMobileNumber,
        operatorToken,
        endpoint
      );
      setIsLoading(false);
      const credentials = {
        endpoint,
        expiry: response.ttl.getTime(),
        operatorToken: operatorToken,
        sessionToken: response.sessionToken,
      };
      setAuthCredentials(`${operatorToken}${endpoint}`, credentials);
      onSuccess(credentials);
    } catch (e) {
      Sentry.captureException(e);
      if (
        e instanceof OTPWrongError ||
        e instanceof OTPExpiredError ||
        e instanceof OTPEmptyError
      ) {
        showErrorAlert(e);
      } else if (e instanceof LoginLockedError) {
        const matches = e.message.match(/\d+/g);
        showErrorAlert(e, () => resetStage(), {
          // We assume backend error message has the number of minutes for user to wait before retrying
          // Adding a fallback in case this assumption fails
          minutes:
            (matches && matches[0]) ??
            i18nt("errorMessages", "dynamicContentFallback", "minutes"),
        });
      } else if (e instanceof LoginError) {
        showErrorAlert(e, () => resetStage());
      } else {
        setState(() => {
          throw e; // Let ErrorBoundary handle
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
    const isRequestSuccessful = await handleRequestOTP(fullMobileNumber);
    setIsResending(false);
    if (isRequestSuccessful) setResendDisabledTime(RESEND_OTP_TIME_LIMIT);
  };

  const handleChange = (text: string): void => {
    /^\d*$/.test(text) && setOTPValue(text);
  };

  return (
    <Card>
      <AppText>{`${i18nt("loginOTPCard", "sendingOtp")}`}</AppText>
      <View style={styles.inputAndButtonWrapper} testID="login-otp-card-view">
        <InputWithLabel
          label={i18nt("loginOTPCard", "otp")}
          value={oTPValue}
          onChange={({ nativeEvent: { text } }) => handleChange(text)}
          onSubmitEditing={onSubmitOTP}
          keyboardType="numeric"
          accessibilityLabel="login-otp"
        />
        <View style={styles.buttonsWrapper}>
          {resendDisabledTime > 0 ? (
            <AppText style={styles.resendCountdownText}>
              {i18nt("loginOTPCard", "resendIn", undefined, {
                ss: resendDisabledTime / 1000,
              })}
            </AppText>
          ) : (
            <SecondaryButton
              text={i18nt("loginOTPCard", "resend")}
              onPress={resendOTP}
              isLoading={isResending}
              disabled={isLoading}
            />
          )}
          <View style={styles.submitWrapper}>
            <DarkButton
              text={i18nt("loginOTPCard", "submit")}
              fullWidth={true}
              onPress={onSubmitOTP}
              isLoading={isLoading}
              disabled={isResending}
              accessibilityLabel="login-submit-otp-button"
            />
          </View>
        </View>
      </View>
    </Card>
  );
};
