import React, { useState, FunctionComponent, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NavigationProps } from "../../types";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { DangerButton } from "../Layout/Buttons/DangerButton";
import { authenticate } from "../../services/auth";
import { useAuthenticationContext } from "../../context/auth";
import { size, color } from "../../common/styles";
import { AppName } from "../Layout/AppName";
import { Card } from "../Layout/Card";
import { TopBackground } from "../Layout/TopBackground";
import { AppText } from "../Layout/AppText";
import * as Permissions from "expo-permissions";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import {
  NricScanner,
  BarCodeScanningResult
} from "../CustomerDetails/NricScanner";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Credits } from "../Credits";
import { useConfigContext, AppMode } from "../../context/config";
import { useProductContext } from "../../context/products";
import { decodeQr } from "./utils";

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
  const { setProducts } = useProductContext();
  const { setAuthKey, setEndpoint } = useAuthenticationContext();
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const { config, setConfigValue } = useConfigContext();

  const askForCameraPermission = async (): Promise<void> => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status === "granted");
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

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

  const onLogin = async (qrCode: string): Promise<void> => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { key, endpoint } = decodeQr(qrCode);
      const authenticated = await authenticate(key, endpoint);
      if (authenticated) {
        setAuthKey(key);
        setEndpoint(endpoint);
        setIsLoading(false);
        setShowScanner(false);
        setProducts(authenticated.policies);
        navigation.navigate("CollectCustomerDetailsScreen");
      } else {
        throw new Error("Authentication key is invalid");
      }
    } catch (e) {
      setShowScanner(false);
      alert(e.message || e);
      setIsLoading(false);
    }
  };

  const onBarCodeScanned = (event: BarCodeScanningResult): void => {
    if (!isLoading && event.data) {
      onToggleScanner();
      onLogin(event.data);
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
          <Card>
            <AppText>
              Please log in with your Unique ID provided by your supervisor
            </AppText>
            <View style={styles.scanButtonWrapper}>
              <DarkButton
                text="Scan to Login"
                onPress={onToggleScanner}
                icon={
                  <Feather
                    name="maximize"
                    size={size(2)}
                    color={color("grey", 0)}
                  />
                }
                fullWidth={true}
                isLoading={isLoading}
              />
            </View>
          </Card>
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
