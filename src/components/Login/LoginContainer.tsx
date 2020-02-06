import React, { useState, FunctionComponent, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from "react-native";
import { NavigationProps } from "../../types";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { DangerButton } from "../Layout/Buttons/DangerButton";
import { authenticate } from "../../services/auth";
import { useAuthenticationContext } from "../../context/auth";
import { size, color } from "../../common/styles";
import { AppName } from "../Layout/AppName";
import { Card } from "../Layout/Card";
import { InputWithLabel } from "../Layout/InputWithLabel";
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
import { useConfig, AppMode } from "../../common/hooks/useConfig";

const TIME_HELD_TO_CHANGE_APP_MODE = 5 * 1000;

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
  inputAndButtonWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: size(3),
    marginBottom: size(3)
  },
  inputWrapper: {
    flex: 1,
    marginRight: size(1)
  }
});

export const InitialisationContainer: FunctionComponent<NavigationProps> = ({
  navigation
}: NavigationProps) => {
  const { setAuthKey } = useAuthenticationContext();
  const [inputAuthKey, setInputAuthKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [showScanner, setShowScanner] = useState(false);
  const { config, setValue } = useConfig();

  const askForCameraPermission = async (): Promise<void> => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status === "granted");
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const onToggleAppMode = (): void => {
    const nextMode =
      config.appMode === AppMode.production
        ? AppMode.staging
        : AppMode.production;
    setValue("appMode", nextMode);
    alert(`Rationally in ${nextMode.toUpperCase()} mode`);
  };

  const onToggleScanner = (): void => {
    if (!hasCameraPermission) {
      askForCameraPermission();
    }
    setShowScanner(s => !s);
  };

  const onLogin = async (key: string): Promise<void> => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const authenticated = await authenticate(key, config.appMode);
      if (authenticated) {
        setAuthKey(key);
        setIsLoading(false);
        setShowScanner(false);
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
      setInputAuthKey(event.data);
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
              Please log in with your Unique ID provided by your supervisor / in
              your letter.
            </AppText>
            <View style={styles.inputAndButtonWrapper}>
              <View style={styles.inputWrapper}>
                <InputWithLabel
                  label="Unique ID"
                  value={inputAuthKey}
                  onChange={({ nativeEvent: { text } }) =>
                    setInputAuthKey(text)
                  }
                  onSubmitEditing={() => onLogin(inputAuthKey)}
                />
              </View>
              <SecondaryButton text="Scan" onPress={onToggleScanner} />
            </View>
            <DarkButton
              text="Login"
              onPress={() => onLogin(inputAuthKey)}
              fullWidth={true}
              isLoading={isLoading}
            />
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
