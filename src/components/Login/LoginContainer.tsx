import React, { useState, FunctionComponent, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from "react-native";
import { NavigationProps, LOGIN_STAGES } from "../../types";
import { DangerButton } from "../Layout/Buttons/DangerButton";
import { useAuthenticationContext } from "../../context/auth";
import { size, color } from "../../common/styles";
import { AppName } from "../Layout/AppName";
import { TopBackground } from "../Layout/TopBackground";
import * as Permissions from "expo-permissions";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import {
  NricScanner,
  BarCodeScanningResult
} from "../CustomerDetails/NricScanner";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Credits } from "../Credits";
import { useConfigContext, AppMode } from "../../context/config";
import { decodeQr } from "./utils";
import { LoginScanCard } from "./LoginScanCard";
import { LoginMobileNumberCard } from "./LoginMobileNumberCard";
import { LoginOTPCard } from "./LoginOTPCard";

const TIME_HELD_TO_CHANGE_APP_MODE = 5 * 1000;

const ALLOW_MODE_CHANGE = false;

const styles = StyleSheet.create({
  content: {
    padding: size(3),
    marginTop: -size(3),
    maxWidth: 512,
    width: "100%",
    height: "100%",
    justifyContent: "center"
  },
  cameraWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color("grey", 0)
  },
  cancelButtonWrapper: {
    marginTop: size(3),
    marginBottom: size(4)
  },
  headerText: {
    marginBottom: size(4),
    textAlign: "center",
    alignSelf: "center"
  },
  scanButtonWrapper: {
    marginTop: size(3)
  }
});

export const InitialisationContainer: FunctionComponent<NavigationProps> = ({
  navigation
}: NavigationProps) => {
  const { token, endpoint } = useAuthenticationContext();
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const { config, setConfigValue } = useConfigContext();
  const [loginStage, setLoginStage] = useState(LOGIN_STAGES.SCAN);
  const [mobileNumber, setMobileNumber] = useState("");
  const [codeKey, setCodeKey] = useState("");
  const [endpointTemp, setEndpointTemp] = useState("");

  const askForCameraPermission = async (): Promise<void> => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status === "granted");
  };

  useEffect(() => {
    if (token && endpoint) {
      navigation.navigate("CollectCustomerDetailsScreen");
    } else {
      askForCameraPermission();
    }
  }, [endpoint, navigation, token]);

  const onToggleAppMode = (): void => {
    if (!ALLOW_MODE_CHANGE) return;
    const nextMode =
      config.appMode === AppMode.production
        ? AppMode.staging
        : AppMode.production;
    setConfigValue("appMode", nextMode);
    alert(`SupplyAlly in ${nextMode.toUpperCase()} mode`);
  };

  const onToggleScanner = (): void => {
    if (!hasCameraPermission) {
      askForCameraPermission();
    }
    setShowScanner(s => !s);
  };

  const onBarCodeScanned = (event: BarCodeScanningResult): void => {
    if (!isLoading && event.data) {
      const qrCode = event.data;
      onToggleScanner();
      setIsLoading(true);
      const { key, endpoint } = decodeQr(qrCode);
      setCodeKey(key);
      setEndpointTemp(endpoint);
      setIsLoading(false);
      setShowScanner(false);
      setLoginStage(LOGIN_STAGES.MOBILE_NUMBER);
    }
  };

  const shouldShowCamera = hasCameraPermission && showScanner;

  return (
    <>
      <KeyboardAvoidingView style={{ alignItems: "center" }} behavior="padding">
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
              <AppName mode={config.appMode} hideLogout />
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
          {loginStage === LOGIN_STAGES.SCAN && (
            <LoginScanCard
              setLoginStage={setLoginStage}
              onToggleScanner={onToggleScanner}
              isLoading={isLoading}
            />
          )}
          {loginStage === LOGIN_STAGES.MOBILE_NUMBER && (
            <LoginMobileNumberCard
              setLoginStage={setLoginStage}
              mobileNumber={mobileNumber}
              setMobileNumber={setMobileNumber}
              codeKey={codeKey}
              endpoint={endpointTemp}
            />
          )}
          {loginStage === LOGIN_STAGES.OTP && (
            <LoginOTPCard
              navigation={navigation}
              mobileNumber={mobileNumber}
              codeKey={codeKey}
              endpoint={endpointTemp}
            />
          )}
        </View>
      </KeyboardAvoidingView>
      <Credits style={{ bottom: size(3) }} />
      {shouldShowCamera && (
        <View style={styles.cameraWrapper}>
          <NricScanner
            onBarCodeScanned={onBarCodeScanned}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          />
          <View style={styles.cancelButtonWrapper}>
            <SecondaryButton text="Cancel" onPress={onToggleScanner} />
          </View>
        </View>
      )}
    </>
  );
};
