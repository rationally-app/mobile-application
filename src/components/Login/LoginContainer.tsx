import React, {
  useState,
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useContext
} from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Vibration
} from "react-native";
import { NavigationProps } from "../../types";
import { DangerButton } from "../Layout/Buttons/DangerButton";
import { useAuthenticationContext } from "../../context/auth";
import { size } from "../../common/styles";
import { TopBackground } from "../Layout/TopBackground";
import { BarCodeScanner, BarCodeScannedCallback } from "expo-barcode-scanner";
import { Credits } from "../Credits";
import { useConfigContext, AppMode } from "../../context/config";
import { decodeQr } from "./utils";
import { LoginScanCard } from "./LoginScanCard";
import { LoginMobileNumberCard } from "./LoginMobileNumberCard";
import { LoginOTPCard } from "./LoginOTPCard";
import { AppName } from "../Layout/AppName";
import { IdScanner } from "../IdScanner/IdScanner";
import * as Sentry from "sentry-expo";
import { LoginStage } from "./types";
import { HelpModalContext } from "../../context/help";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { Banner } from "../Layout/Banner";
import { DarkButton } from "../Layout/Buttons/DarkButton";

const TIME_HELD_TO_CHANGE_APP_MODE = 5 * 1000;

const ALLOW_MODE_CHANGE = false;

const styles = StyleSheet.create({
  content: {
    padding: size(2),
    marginTop: -size(3),
    width: 512,
    maxWidth: "100%",
    height: "100%",
    justifyContent: "center"
  },
  headerText: {
    marginBottom: size(4),
    textAlign: "center",
    alignSelf: "center"
  },
  scanButtonWrapper: {
    marginTop: size(3)
  },
  bannerWrapper: {
    marginBottom: size(1.5)
  }
});

export const InitialisationContainer: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({ category: "navigation", message: "LoginContainer" });
  }, []);

  const { token, endpoint } = useAuthenticationContext();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const { config, setConfigValue } = useConfigContext();
  const [loginStage, setLoginStage] = useState<LoginStage>("SCAN");
  const [mobileNumber, setMobileNumber] = useState("");
  const [codeKey, setCodeKey] = useState("");
  const [endpointTemp, setEndpointTemp] = useState("");
  const showHelpModal = useContext(HelpModalContext);
  const messageContent = useContext(ImportantMessageContentContext);

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "loginStage",
      message: loginStage
    });
  }, [loginStage]);

  useLayoutEffect(() => {
    if (token && endpoint) {
      navigation.navigate("CollectCustomerDetailsScreen");
    }
  }, [endpoint, navigation, token]);

  useEffect(() => {
    const navKey = navigation.getParam("key", "");
    const navEndpoint = navigation.getParam("endpoint", "");
    if (navKey && navEndpoint) {
      setCodeKey(navKey);
      setEndpointTemp(navEndpoint);
      setLoginStage("MOBILE_NUMBER");
    }
  }, [navigation]);

  const onToggleAppMode = (): void => {
    if (!ALLOW_MODE_CHANGE) return;
    const nextMode =
      config.appMode === AppMode.production
        ? AppMode.staging
        : AppMode.production;
    setConfigValue("appMode", nextMode);
    alert(`SupplyAlly in ${nextMode.toUpperCase()} mode`);
  };

  const onBarCodeScanned: BarCodeScannedCallback = event => {
    if (!isLoading && event.data) {
      const qrCode = event.data;
      setShouldShowCamera(false);
      setIsLoading(true);
      try {
        const { key, endpoint } = decodeQr(qrCode);
        Vibration.vibrate(50);
        setCodeKey(key);
        setEndpointTemp(endpoint);
        setIsLoading(false);
        setLoginStage("MOBILE_NUMBER");
      } catch (e) {
        alert("Invalid QR code");
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView
          style={{ alignItems: "center" }}
          behavior="padding"
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
                codeKey={codeKey}
                endpoint={endpointTemp}
              />
            )}
            {loginStage === "OTP" && (
              <LoginOTPCard
                navigation={navigation}
                mobileNumber={mobileNumber}
                codeKey={codeKey}
                endpoint={endpointTemp}
              />
            )}
            <View>
              <DarkButton
                fullWidth={true}
                text="Merchant Payout"
                onPress={() => navigation.navigate("MerchantPayoutStack")}
              />
            </View>
            <FeatureToggler feature="HELP_MODAL">
              <HelpButton onPress={showHelpModal} />
            </FeatureToggler>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <Credits style={{ bottom: size(3) }} />
      {shouldShowCamera && (
        <IdScanner
          onBarCodeScanned={onBarCodeScanned}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onCancel={() => setShouldShowCamera(false)}
          cancelButtonText="Cancel"
        />
      )}
    </>
  );
};
