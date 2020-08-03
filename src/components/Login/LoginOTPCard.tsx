import React, {
  useState,
  useEffect,
  FunctionComponent,
  MutableRefObject
} from "react";
import { View, StyleSheet, Alert } from "react-native";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { size, fontSize } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { useAuthenticationContext } from "../../context/auth";
import { validateOTP, requestOTP, LoginError } from "../../services/auth";
import { getEnvVersion, EnvVersionError } from "../../services/envVersion";
import { useProductContext } from "../../context/products";
import { Sentry } from "../../utils/errorTracking";

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
  lastResendWarningMessage: MutableRefObject<string>;
}

export const LoginOTPCard: FunctionComponent<LoginOTPCard> = ({
  resetStage,
  mobileNumber,
  codeKey,
  endpoint,
  lastResendWarningMessage
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [oTPValue, setOTPValue] = useState("");
  const [resendDisabledTime, setResendDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT
  );

  const { setAuthInfo } = useAuthenticationContext();
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

  const checkIfLockedOut = (e: LoginError): void => {
    if (e.message.includes("Please wait")) resetStage();
  };

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
      if (e instanceof EnvVersionError) {
        Sentry.captureException(e);
        alert(
          "Encountered an issue obtaining environment information. We've noted this down and are looking into it!"
        );
      } else if (e instanceof LoginError) {
        Alert.alert(
          "Error",
          e.message,
          [
            {
              text: "OK",
              onPress: () => {
                checkIfLockedOut(e);
              }
            }
          ],
          {
            cancelable: false
          }
        );
      } else {
        alert(e);
      }
      setIsLoading(false);
    }
  };

  const onSubmitOTP = (): void => {
    onValidateOTP(oTPValue);
  };

  const resendOTP = async (): Promise<void> => {
    setIsResending(true);
    try {
      const response = await requestOTP(mobileNumber, codeKey, endpoint);
      if (typeof response.warning === "string") {
        lastResendWarningMessage.current = response.warning;
      }
      setIsResending(false);
      setResendDisabledTime(RESEND_OTP_TIME_LIMIT);
    } catch (e) {
      if (e instanceof LoginError) {
        Alert.alert(
          "Error",
          e.message,
          [
            {
              text: "OK",
              onPress: () => {
                checkIfLockedOut(e);
              }
            }
          ],
          {
            cancelable: false
          }
        );
      } else {
        alert(e);
      }
      setIsResending(false);
    }
  };

  const alertBeforeResend = (): void => {
    Alert.alert(
      "Resend OTP?",
      lastResendWarningMessage.current,
      [
        {
          text: "RESEND",
          onPress: async () => {
            await resendOTP();
            lastResendWarningMessage.current = "";
          }
        },
        { text: "CANCEL" }
      ],
      { cancelable: false }
    );
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
              onPress={
                lastResendWarningMessage.current === "" ? resendOTP : alertBeforeResend
              }
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
