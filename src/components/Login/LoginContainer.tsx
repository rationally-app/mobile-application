import React, {
  useState,
  FunctionComponent,
  useEffect,
  useContext,
  useRef,
} from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Vibration,
  BackHandler,
} from "react-native";
import { NavigationProps, AuthCredentials } from "../../types";
import { DangerButton } from "../Layout/Buttons/DangerButton";
import { size, borderRadius, color } from "../../common/styles";
import { TopBackground } from "../Layout/TopBackground";
import { BarCodeScannedCallback } from "expo-barcode-scanner";
import { Credits } from "../Credits";
import { useConfigContext, AppMode } from "../../context/config";
import { decodeQr } from "./utils";
import { LoginScanCard } from "./LoginScanCard";
import { LoginMobileNumberCard } from "./LoginMobileNumberCard";
import { LoginOTPCard } from "./LoginOTPCard";
import { AppName } from "../Layout/AppName";
import { IdScanner } from "../IdScanner/IdScanner";
import { Sentry } from "../../utils/errorTracking";
import { LoginStage } from "./types";
import { HelpModalContext } from "../../context/help";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { Banner } from "../Layout/Banner";
import { KeyboardAvoidingScrollView } from "../Layout/KeyboardAvoidingScrollView";
import * as Linking from "expo-linking";
import { DOMAIN_FORMAT } from "../../config";
import {
  requestOTP,
  LoginError,
  LoginRegexError,
  AuthError,
} from "../../services/auth";
import {
  AlertModalContext,
  CONFIRMATION_MESSAGE,
  ERROR_MESSAGE,
} from "../../context/alert";
import { AuthStoreContext } from "../../context/authStore";
import { Feather } from "@expo/vector-icons";
import { createFullNumber } from "../../utils/validatePhoneNumbers";

const TIME_HELD_TO_CHANGE_APP_MODE = 5 * 1000;

const ALLOW_MODE_CHANGE = false;

const styles = StyleSheet.create({
  content: {
    padding: size(2),
    width: 512,
    maxWidth: "100%",
    height: "100%",
    justifyContent: "center",
  },
  headerText: {
    marginTop: size(3),
    marginBottom: size(4),
    textAlign: "center",
    alignSelf: "center",
  },
  scanButtonWrapper: {
    marginTop: size(3),
  },
  bannerWrapper: {
    marginBottom: size(1.5),
  },
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius(2),
    padding: size(1),
    position: "absolute",
    top: size(3),
    right: size(1),
  },
});

const CloseButton: FunctionComponent<{
  onPress: () => void;
}> = ({ onPress }) => (
  <View style={styles.closeButton}>
    <TouchableOpacity onPress={onPress}>
      <Feather name="x" size={size(3)} color={color("grey", 0)} />
    </TouchableOpacity>
  </View>
);

export const InitialisationContainer: FunctionComponent<NavigationProps> = ({
  navigation,
}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "LoginContainer",
    });
  }, []);

  const { hasLoadedFromStore, authCredentials } = useContext(AuthStoreContext);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const { config, setConfigValue } = useConfigContext();
  const [loginStage, setLoginStage] = useState<LoginStage>("SCAN");
  const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [tempAuthCredentials, setTempAuthCredentials] =
    useState<Pick<AuthCredentials, "endpoint" | "operatorToken">>();
  const showHelpModal = useContext(HelpModalContext);
  const messageContent = useContext(ImportantMessageContentContext);
  const { showConfirmationAlert, showErrorAlert } =
    useContext(AlertModalContext);
  const lastResendWarningMessageRef = useRef("");

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "loginStage",
      message: loginStage,
    });
  }, [loginStage]);

  const resetStage = (): void => {
    setLoginStage("SCAN");
  };

  const getResendConfirmationIfNeeded = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!lastResendWarningMessageRef.current) {
        resolve(true);
      } else {
        showConfirmationAlert(
          CONFIRMATION_MESSAGE.RESEND_OTP,
          () => resolve(true),
          () => resolve(false)
        );
      }
    });
  };

  const setState = useState()[1];
  const handleRequestOTP = async (
    fullMobileNumber: string
  ): Promise<boolean> => {
    try {
      if (!(await getResendConfirmationIfNeeded())) return false;
      const response = await requestOTP(
        fullMobileNumber,
        tempAuthCredentials?.operatorToken ?? "",
        tempAuthCredentials?.endpoint ?? ""
      );
      lastResendWarningMessageRef.current = response.warning ?? "";
      return true;
    } catch (e) {
      if (e instanceof LoginError) {
        showErrorAlert(e, () => resetStage(), { minutes: e.message });
      } else {
        setState(() => {
          throw e; // Let ErrorBoundary handle
        });
      }
      return false;
    }
  };

  const onPressClose = (): void => {
    navigation.navigate("CampaignLocationsScreen");
  };

  const onSuccess = (authCredentials: AuthCredentials): void => {
    setConfigValue("fullMobileNumber", { countryCode, mobileNumber });
    navigation.navigate("CampaignInitialisationScreen", { authCredentials });
  };

  useEffect(() => {
    const skipScanningIfParamsInDeepLink = async (): Promise<void> => {
      const { queryParams } = await Linking.parseInitialURLAsync();
      const queryEndpoint = queryParams?.endpoint;
      const queryKey = queryParams?.key;

      if (queryEndpoint && queryKey) {
        if (!RegExp(DOMAIN_FORMAT).test(queryEndpoint)) {
          const error = new Error(`Invalid endpoint: ${queryEndpoint}`);
          Sentry.captureException(error);
          showErrorAlert(error);
          setLoginStage("SCAN");
        } else {
          setTempAuthCredentials({
            endpoint: queryEndpoint,
            operatorToken: queryKey,
          });
          setLoginStage("MOBILE_NUMBER");
        }
      }
    };
    skipScanningIfParamsInDeepLink();
  }, [showErrorAlert]);

  const onToggleAppMode = (): void => {
    if (!ALLOW_MODE_CHANGE) return;
    const nextMode =
      config.appMode === AppMode.production
        ? AppMode.staging
        : AppMode.production;
    setConfigValue("appMode", nextMode);
    alert(`SupplyAlly in ${nextMode.toUpperCase()} mode`);
  };

  // Close camera when back action is triggered
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (shouldShowCamera) {
          setShouldShowCamera(false);
          return true;
        }
        return false;
      }
    );
    return () => {
      backHandler.remove();
    };
  }, [shouldShowCamera]);

  const onBarCodeScanned: BarCodeScannedCallback = (event) => {
    if (!isLoading && event.data) {
      const qrCode = event.data;
      setShouldShowCamera(false);
      setIsLoading(true);
      try {
        const { key, endpoint } = decodeQr(qrCode);
        Vibration.vibrate(50);
        if (!RegExp(DOMAIN_FORMAT).test(endpoint))
          throw new LoginRegexError(ERROR_MESSAGE.AUTH_FAILURE_INVALID_TOKEN);
        setTempAuthCredentials({
          endpoint,
          operatorToken: key,
        });
        setIsLoading(false);
        setLoginStage("MOBILE_NUMBER");
      } catch (e) {
        const error = new Error(`onBarCodeScanned ${e}`);
        Sentry.captureException(error);
        if (e instanceof AuthError || e instanceof LoginRegexError) {
          showErrorAlert(e);
        } else {
          setState(() => {
            throw error; // Let ErrorBoundary handle
          });
        }
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Credits style={{ bottom: size(10) }} />
      <KeyboardAvoidingScrollView
        keyboardAvoidingViewStyle={{ flex: 1 }}
        scrollViewContentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingBottom: size(8),
        }}
      >
        <TopBackground
          style={{ height: "50%", maxHeight: "auto" }}
          mode={config.appMode}
        />

        <View style={styles.content}>
          <TouchableWithoutFeedback
            delayLongPress={TIME_HELD_TO_CHANGE_APP_MODE}
            onLongPress={onToggleAppMode}
          >
            <View style={styles.headerText}>
              <AppName mode={config.appMode} />
            </View>
          </TouchableWithoutFeedback>
          {config.appMode !== AppMode.production && (
            <View style={{ marginVertical: size(2.5) }}>
              <DangerButton
                text="Exit Testing Mode"
                onPress={onToggleAppMode}
                fullWidth={true}
                isLoading={isLoading}
              />
            </View>
          )}

          {messageContent && (
            <View style={styles.bannerWrapper}>
              <Banner {...messageContent} />
            </View>
          )}

          {loginStage === "SCAN" && (
            <LoginScanCard
              onToggleScanner={() => setShouldShowCamera(true)}
              isLoading={isLoading}
            />
          )}
          {loginStage === "MOBILE_NUMBER" && (
            <LoginMobileNumberCard
              setLoginStage={setLoginStage}
              setMobileNumber={setMobileNumber}
              setCountryCode={setCountryCode}
              handleRequestOTP={handleRequestOTP}
            />
          )}
          {loginStage === "OTP" && (
            <LoginOTPCard
              resetStage={resetStage}
              fullMobileNumber={createFullNumber(countryCode, mobileNumber)}
              operatorToken={tempAuthCredentials?.operatorToken ?? ""}
              endpoint={tempAuthCredentials?.endpoint ?? ""}
              handleRequestOTP={handleRequestOTP}
              onSuccess={onSuccess}
            />
          )}
          <FeatureToggler feature="HELP_MODAL">
            <HelpButton onPress={showHelpModal} />
          </FeatureToggler>
          {hasLoadedFromStore && Object.keys(authCredentials).length >= 1 && (
            <CloseButton onPress={onPressClose} />
          )}
        </View>
      </KeyboardAvoidingScrollView>
      {shouldShowCamera && (
        <IdScanner
          onBarCodeScanned={onBarCodeScanned}
          onCancel={() => setShouldShowCamera(false)}
        />
      )}
    </>
  );
};
