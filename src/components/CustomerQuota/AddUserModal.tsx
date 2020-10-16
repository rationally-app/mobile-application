import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext
} from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { InputIdSection } from "../CustomerDetails/InputIdSection";
import { IdScanner } from "../IdScanner/IdScanner";
import { BarCodeScanner, BarCodeScannedCallback } from "expo-barcode-scanner";
import { color, size } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { Feather } from "@expo/vector-icons";
import { KeyboardAvoidingScrollView } from "../Layout/KeyboardAvoidingScrollView";
import { CampaignConfigContext } from "../../context/campaignConfig";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

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
  validateAndUpdateIds: (input: string) => Promise<void>;
}

export const AddUserModal: FunctionComponent<AddUserModal> = ({
  isVisible,
  setIsVisible,
  validateAndUpdateIds
}) => {
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const [idInput, setIdInput] = useState("");
  const { features } = useContext(CampaignConfigContext);
  const { i18nt } = useTranslate();

  useEffect(() => {
    if (isVisible) {
      setIsScanningEnabled(true);
    }
  }, [isVisible]);

  const onCheck = async (input: string): Promise<void> => {
    setIsScanningEnabled(false);
    await validateAndUpdateIds(input);
    setIdInput("");
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
            barCodeTypes={
              features?.id.scannerType === "QR"
                ? [BarCodeScanner.Constants.BarCodeType.qr]
                : [BarCodeScanner.Constants.BarCodeType.code39]
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
                  {i18nt("customerQuotaScreen", "quotaAddId")}
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
                keyboardType={
                  features?.id.type === "NUMBER" ? "numeric" : "default"
                }
              />
            </Card>
          </View>
        </KeyboardAvoidingScrollView>
      )}
    </Modal>
  );
};
