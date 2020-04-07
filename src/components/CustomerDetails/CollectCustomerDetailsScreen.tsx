import React, { FunctionComponent, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator
} from "react-native";
import { fontSize, size, color } from "../../common/styles";
import { useAuthenticationContext } from "../../context/auth";
import { getQuota } from "../../services/quota";
import { AppName } from "../Layout/AppName";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { Credits } from "../Credits";
import { useConfigContext } from "../../context/config";
import {
  withNavigationFocus,
  NavigationFocusInjectedProps
} from "react-navigation";
import { IdScanner } from "../IdScanner/IdScanner";
import { BarCodeScannedCallback } from "expo-barcode-scanner";
import { validateAndCleanNric } from "../../utils/validateNric";
import { InputNricSection } from "./InputNricSection";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(3),
    paddingVertical: size(8),
    height: "100%",
    width: 512,
    maxWidth: "100%"
  },
  loadingWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
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

const CollectCustomerDetailsScreen: FunctionComponent<NavigationFocusInjectedProps> = ({
  navigation,
  isFocused
}) => {
  const { authKey, endpoint } = useAuthenticationContext();
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const [nricInput, setNricInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { config } = useConfigContext();

  const onCheck = async (input: string): Promise<void> => {
    try {
      const nric = validateAndCleanNric(input);

      setIsLoading(true);
      const quota = await getQuota(nric!, authKey, endpoint);
      setIsLoading(false);

      navigation.navigate("CustomerQuotaScreen", { quota, nric });
      setNricInput("");
    } catch (e) {
      setIsLoading(false);
      setIsScanningEnabled(false);
      Alert.alert(
        "Error",
        e.message || e,
        [
          {
            text: "Dimiss",
            onPress: () => setIsScanningEnabled(true)
          }
        ],
        {
          onDismiss: () => setIsScanningEnabled(true) // for android outside alert clicks
        }
      );
    }
  };

  const onBarCodeScanned: BarCodeScannedCallback = event => {
    if (isFocused && isScanningEnabled && !isLoading && event.data) {
      onCheck(event.data);
    }
  };

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
            <Card>
              <AppText>
                Check the number of items your customer can purchase
              </AppText>
              <InputNricSection
                openCamera={() => setShouldShowCamera(true)}
                nricInput={nricInput}
                setNricInput={setNricInput}
                submitNric={() => onCheck(nricInput)}
              />
            </Card>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <Credits style={{ bottom: size(3) }} />
      {shouldShowCamera &&
        (isLoading ? (
          <View style={styles.loadingWrapper}>
            <TopBackground style={{ height: "100%", maxHeight: "auto" }} />
            <Card>
              <ActivityIndicator size="large" color={color("grey", 40)} />
              <AppText style={{ marginTop: size(1) }}>Checking...</AppText>
            </Card>
          </View>
        ) : (
          <IdScanner
            onBarCodeScanned={onBarCodeScanned}
            onCancel={() => setShouldShowCamera(false)}
            cancelButtonText="Enter NRIC manually"
          />
        ))}
    </>
  );
};

export const CollectCustomerDetailsScreenContainer = withNavigationFocus(
  CollectCustomerDetailsScreen
);
