import React, { FunctionComponent, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
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

const styles = StyleSheet.create({
  bg: {
    backgroundColor: color("blue", 50),
    width: "100%",
    height: "30%",
    position: "absolute"
  },
  content: {
    position: "relative",
    padding: size(3),
    height: "100%",
    width: "100%",
    paddingBottom: size(8)
  },
  cameraWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center"
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
    borderBottomColor: color("grey", 15),
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
  const { authKey } = useAuthenticationContext();
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const [nric, setNric] = useState("");
  const [hasCameraPermission, setHasCameraPermission] = useState();

  const askForCameraPermission = async (): Promise<void> => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status === "granted");
  };
  useEffect(() => {
    askForCameraPermission();
  }, []);

  const onCheck = async (input: string): Promise<void> => {
    try {
      const isNricValid = validate(input);
      if (!isNricValid) throw new Error("Invalid NRIC number");
      const nric = input.match(nricRegex)?.[0].toUpperCase();
      const quota = await getQuota(nric!, authKey);
      navigation.navigate("CustomerQuotaScreen", { quota, nric });
    } catch (e) {
      alert(e.message || e);
    }
  };

  const onBarCodeScanned = (event: BarCodeScanningResult): void => {
    if (event.data) {
      setNric(event.data);
      onCheck(event.data);
    }
  };

  const onCheckPress = (): Promise<void> => {
    return onCheck(nric);
  };

  const onToggleScanner = (): void => {
    setScannerEnabled(!scannerEnabled);
  };

  const shouldShowCamera = hasCameraPermission && scannerEnabled;

  return (
    <ScrollView>
      <View style={styles.bg} />
      <SafeAreaView>
        <KeyboardAvoidingView behavior="position">
          <View style={styles.content}>
            <View style={styles.headerText}>
              <AppName />
            </View>
            {shouldShowCamera ? (
              <View style={styles.cameraWrapper}>
                <NricScanner onBarCodeScanned={onBarCodeScanned} />
                <View style={styles.cancelButtonWrapper}>
                  <DarkButton text="Cancel" onPress={onToggleScanner} />
                </View>
              </View>
            ) : (
              <Card>
                <AppText>
                  Enter customer’s NRIC to retrieve the number of masks he/she
                  can purchase
                </AppText>
                <View style={styles.scanButtonWrapper}>
                  <DarkButton
                    fullWidth={true}
                    text="Scan customer's NRIC"
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
                      label="Customer NRIC"
                      value={nric}
                      onChange={({ nativeEvent: { text } }) => setNric(text)}
                    />
                  </View>
                  <SecondaryButton text="Check" onPress={onCheckPress} />
                </View>
              </Card>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};
