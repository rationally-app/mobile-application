import React, { FunctionComponent, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Vibration,
  Platform
} from "react-native";
import { InputNricSection } from "../CustomerDetails/InputNricSection";
import { IdScanner } from "../IdScanner/IdScanner";
import { validateAndCleanNric } from "../../utils/validateNric";
import { BarCodeScannedCallback } from "expo-barcode-scanner";
import { color, size } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { Feather } from "@expo/vector-icons";

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color("grey", 100),
    opacity: 0.8
  },
  scrollWrapper: {
    alignItems: "center",
    minHeight: "100%"
  },
  cardWrapper: {
    padding: size(3),
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    width: 512,
    maxWidth: "100%"
  },
  cardHeader: { flexDirection: "row", width: "100%" },
  cameraWrapper: {
    flex: 1
  }
});

const CloseButton: FunctionComponent<{ onPress: () => void }> = ({
  onPress
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      position: "relative",
      top: -size(2),
      right: -size(2),
      alignItems: "center",
      justifyContent: "center",
      padding: size(0.5),
      minHeight: size(5),
      minWidth: size(5)
    }}
  >
    <Feather name="x" size={size(3)} color={color("blue", 50)} />
  </TouchableOpacity>
);

interface AddUserModal {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  nrics: string[];
  addNric: (nric: string) => void;
}

export const AddUserModal: FunctionComponent<AddUserModal> = ({
  isVisible,
  setIsVisible,
  nrics,
  addNric
}) => {
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const [nricInput, setNricInput] = useState("");

  useEffect(() => {
    if (isVisible) {
      setIsScanningEnabled(true);
    }
  }, [isVisible]);

  const onCheck = async (input: string): Promise<void> => {
    try {
      setIsScanningEnabled(false);
      const nric = validateAndCleanNric(input);
      Vibration.vibrate(50);
      if (nrics.indexOf(nric) > -1) {
        throw new Error(
          "You've added this NRIC before, please scan a different NRIC."
        );
      }
      addNric(nric);
      setIsVisible(false);
      setNricInput("");
    } catch (e) {
      setIsScanningEnabled(false);
      Alert.alert(
        "Error",
        e.message || e,
        [
          {
            text: "OK",
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
    if (isScanningEnabled && event.data) {
      onCheck(event.data);
    }
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={() => {
        if (shouldShowCamera) {
          setShouldShowCamera(false);
        } else {
          setIsVisible(false);
        }
      }}
      transparent={true}
      animationType="fade"
    >
      {shouldShowCamera ? (
        <View style={styles.cameraWrapper}>
          <IdScanner
            onBarCodeScanned={onBarCodeScanned}
            onCancel={() => setShouldShowCamera(false)}
            cancelButtonText="Enter ID manually"
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollWrapper}
          scrollIndicatorInsets={{ right: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
            <View style={styles.background} />
          </TouchableWithoutFeedback>
          <View style={styles.cardWrapper}>
            <KeyboardAvoidingView
              behavior={Platform.select({ ios: "position" })}
            >
              <Card style={styles.card}>
                <View style={styles.cardHeader}>
                  <AppText style={{ flex: 1 }}>
                    Add another NRIC to combine customer quotas
                  </AppText>
                  <View style={{ marginLeft: size(1) }}>
                    <CloseButton onPress={() => setIsVisible(false)} />
                  </View>
                </View>
                <InputNricSection
                  openCamera={() => setShouldShowCamera(true)}
                  nricInput={nricInput}
                  setNricInput={setNricInput}
                  submitNric={() => onCheck(nricInput)}
                />
              </Card>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      )}
    </Modal>
  );
};
