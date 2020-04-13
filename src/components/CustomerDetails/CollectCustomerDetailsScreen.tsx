import React, { FunctionComponent, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Vibration
} from "react-native";
import { size } from "../../common/styles";
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
import { AppHeader } from "../Layout/AppHeader";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(2),
    paddingVertical: size(8),
    height: "100%",
    width: 512,
    maxWidth: "100%"
  },
  headerText: {
    marginBottom: size(4)
  }
});

const CollectCustomerDetailsScreen: FunctionComponent<NavigationFocusInjectedProps> = ({
  navigation,
  isFocused
}) => {
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const [nricInput, setNricInput] = useState("");
  const { config } = useConfigContext();

  useEffect(() => {
    if (isFocused) {
      setIsScanningEnabled(true);
    }
  }, [isFocused]);

  const onCheck = async (input: string): Promise<void> => {
    try {
      setIsScanningEnabled(false);
      const nric = validateAndCleanNric(input);
      Vibration.vibrate(50);
      navigation.navigate("CustomerQuotaScreen", { nric });
      setNricInput("");
    } catch (e) {
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
    if (isFocused && isScanningEnabled && event.data) {
      onCheck(event.data);
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        scrollIndicatorInsets={{ right: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <TopBackground mode={config.appMode} />
        <KeyboardAvoidingView behavior="position">
          <View style={styles.content}>
            <View style={styles.headerText}>
              <AppHeader mode={config.appMode} />
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
      {shouldShowCamera && (
        <IdScanner
          isScanningEnabled={isScanningEnabled}
          onBarCodeScanned={onBarCodeScanned}
          onCancel={() => setShouldShowCamera(false)}
          cancelButtonText="Enter NRIC manually"
        />
      )}
    </>
  );
};

export const CollectCustomerDetailsScreenContainer = withNavigationFocus(
  CollectCustomerDetailsScreen
);
