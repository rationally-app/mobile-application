import React, { FunctionComponent, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration
} from "react-native";
import { InputIdSection } from "../CustomerDetails/InputIdSection";
import { IdScanner } from "../IdScanner/IdScanner";
import { validateAndCleanId } from "../../utils/validateIdentification";
import { BarCodeScanner, BarCodeScannedCallback } from "expo-barcode-scanner";
import { color, size } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { Feather } from "@expo/vector-icons";
import { KeyboardAvoidingScrollView } from "../Layout/KeyboardAvoidingScrollView";
import { useProductContext } from "../../context/products";

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
  ids: string[];
  addId: (id: string) => void;
}

export const AddUserModal: FunctionComponent<AddUserModal> = ({
  isVisible,
  setIsVisible,
  ids,
  addId
}) => {
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const [idInput, setIdInput] = useState("");
  const { features } = useProductContext();

  useEffect(() => {
    if (isVisible) {
      setIsScanningEnabled(true);
    }
  }, [isVisible]);

  const onCheck = async (input: string): Promise<void> => {
    try {
      setIsScanningEnabled(false);
      const id = validateAndCleanId(
        input,
        features?.id.validation,
        features?.id.validationRegex
      );
      Vibration.vibrate(50);
      if (ids.indexOf(id) > -1) {
        throw new Error(
          "You've added this ID before, please scan a different ID."
        );
      }
      addId(id);
      setIsVisible(false);
      setIdInput("");
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
            barCodeTypes={
              features?.id.scannerType === "CODE_39"
                ? [BarCodeScanner.Constants.BarCodeType.code39]
                : [BarCodeScanner.Constants.BarCodeType.qr]
            }
          />
        </View>
      ) : (
        <KeyboardAvoidingScrollView
          scrollViewContentContainerStyle={styles.scrollWrapper}
        >
          <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
            <View style={styles.background} />
          </TouchableWithoutFeedback>
          <View style={styles.cardWrapper}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <AppText style={{ flex: 1 }}>
                  Add another ID to combine customer quotas
                </AppText>
                <View style={{ marginLeft: size(1) }}>
                  <CloseButton onPress={() => setIsVisible(false)} />
                </View>
              </View>
              <InputIdSection
                openCamera={() => setShouldShowCamera(true)}
                idInput={idInput}
                setIdInput={setIdInput}
                submitId={() => onCheck(idInput)}
                idType={features?.id.type}
              />
            </Card>
          </View>
        </KeyboardAvoidingScrollView>
      )}
    </Modal>
  );
};
