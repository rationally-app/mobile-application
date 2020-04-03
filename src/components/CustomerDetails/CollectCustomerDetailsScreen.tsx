import React, { FunctionComponent, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NavigationProps } from "../../types";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { fontSize, size, color } from "../../common/styles";
import * as Permissions from "expo-permissions";
import { useAuthenticationContext } from "../../context/auth";
import { validate, nricRegex } from "./validateNric";
import { getQuota } from "../../services/quota";
import { AppName } from "../Layout/AppName";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { Card } from "../Layout/Card";
import { BarCodeScanningResult, NricScanner } from "./NricScanner";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { Credits } from "../Credits";
import { useConfigContext } from "../../context/config";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(3),
    paddingVertical: size(8),
    height: "100%",
    width: 512,
    maxWidth: "100%"
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
    marginBottom: size(3)
  },
  scanButtonWrapper: {
    marginTop: size(4),
    marginBottom: size(6)
  },
  horizontalRule: {
    borderBottomColor: color("grey", 30),
    marginHorizontal: -size(3),
    borderBottomWidth: 1
  },
  orWrapper: {
    position: "absolute",
    top: -fontSize(0),
    alignSelf: "center",
    backgroundColor: color("grey", 0),
    padding: size(1)
  },
  orText: {
    fontSize: fontSize(-1),
    fontFamily: "inter-bold"
  },
  inputAndButtonWrapper: {
    marginTop: size(6),
    flexDirection: "row",
    alignItems: "flex-end"
  },
  inputWrapper: {
    flex: 1,
    marginRight: size(1)
  }
});

export const CollectCustomerDetailsScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const { authKey, endpoint } = useAuthenticationContext();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanningEnabled, setScanningEnabled] = useState(true);
  const [nricInput, setNricInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { config } = useConfigContext();

  const askForCameraPermission = async (): Promise<void> => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status === "granted");
  };
  useEffect(() => {
    askForCameraPermission();
  }, []);

  useEffect(() => {
    const willBlurSubscription = navigation.addListener("willBlur", () => {
      setScanningEnabled(false);
    });
    const willFocusSubscription = navigation.addListener("willFocus", () => {
      setScanningEnabled(true);
    });
    return () => {
      willBlurSubscription.remove();
      willFocusSubscription.remove();
    };
  }, [navigation]);

  const onCheck = async (input: string): Promise<void> => {
    try {
      const isNricValid = validate(input);
      if (!isNricValid) throw new Error("Invalid NRIC number");
      const nric = input.match(nricRegex)?.[0].toUpperCase();

      setIsLoading(true);
      const quota = await getQuota(nric!, authKey, endpoint);
      setIsLoading(false);

      navigation.navigate("CustomerQuotaScreen", { quota, nric });
      setNricInput("");
    } catch (e) {
      setIsLoading(false);
      setScanningEnabled(false);
      Alert.alert(
        "Error",
        e.message || e,
        [
          {
            text: "Dimiss",
            onPress: () => setScanningEnabled(true)
          }
        ],
        {
          onDismiss: () => setScanningEnabled(true) // for android outside alert clicks
        }
      );
    }
  };

  const onBarCodeScanned = (event: BarCodeScanningResult): void => {
    if (scanningEnabled && !isLoading && event.data) {
      onCheck(event.data);
    }
  };

  const onCheckPress = (): Promise<void> => onCheck(nricInput);

  const onToggleScanner = (): void => {
    if (!hasCameraPermission) {
      askForCameraPermission();
    }
    setShowScanner(s => !s);
  };

  const shouldShowCamera = hasCameraPermission && showScanner;

  return (
    <>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <TopBackground mode={config.appMode} />
        <KeyboardAvoidingView behavior="position">
          <View style={styles.content}>
            <View style={styles.headerText}>
              <AppName mode={config.appMode} />
            </View>
            {!shouldShowCamera && (
              <Card>
                <AppText>
                  Check the number of items your customer can purchase
                </AppText>
                <View style={styles.scanButtonWrapper}>
                  <DarkButton
                    fullWidth={true}
                    text="Scan customer's NRIC"
                    icon={
                      <Feather
                        name="maximize"
                        size={size(2)}
                        color={color("grey", 0)}
                      />
                    }
                    onPress={onToggleScanner}
                  />
                </View>
                <View style={{ position: "relative" }}>
                  <View style={styles.horizontalRule} />
                  <View style={styles.orWrapper}>
                    <AppText style={styles.orText}>OR</AppText>
                  </View>
                </View>

                <View style={styles.inputAndButtonWrapper}>
                  <View style={styles.inputWrapper}>
                    <InputWithLabel
                      label="Enter NRIC number"
                      value={nricInput}
                      onChange={({ nativeEvent: { text } }) =>
                        setNricInput(text)
                      }
                      onSubmitEditing={onCheckPress}
                    />
                  </View>
                  <SecondaryButton
                    text="Check"
                    onPress={onCheckPress}
                    isLoading={isLoading}
                  />
                </View>
              </Card>
            )}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <Credits style={{ bottom: size(3) }} />
      {shouldShowCamera && (
        <View style={styles.cameraWrapper}>
          {isLoading ? (
            <>
              <TopBackground style={{ height: "100%", maxHeight: "auto" }} />
              <Card>
                <ActivityIndicator size="large" color={color("grey", 40)} />
                <AppText style={{ marginTop: size(1) }}>Checking...</AppText>
              </Card>
            </>
          ) : (
            <>
              <NricScanner onBarCodeScanned={onBarCodeScanned} />
              <View style={styles.cancelButtonWrapper}>
                <SecondaryButton
                  text="Enter NRIC manually"
                  onPress={onToggleScanner}
                />
              </View>
            </>
          )}
        </View>
      )}
    </>
  );
};
