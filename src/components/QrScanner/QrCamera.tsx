import React, { FunctionComponent, useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import { size, fontSize, color } from "../../common/styles";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color("blue", 50)
  },
  rejectedText: {
    margin: size(4),
    textAlign: "center",
    fontSize: fontSize(0),
    color: color("grey", 0)
  }
});

const LoadingView: FunctionComponent = () => (
  <View style={styles.wrapper} testID="loading-view">
    <ActivityIndicator size="large" color={color("grey", 0)} />
  </View>
);

const PermissionsRejectedView: FunctionComponent = () => (
  <View style={styles.wrapper} testID="permissions-rejected-view">
    <Text style={styles.rejectedText}>
      You need to grant camera permissions to view documents
    </Text>
  </View>
);

interface BarCodeScanningResult {
  type: string;
  data: string;
}

export interface QrCamera {
  onQrData?: (data: string) => void;
  disabled?: boolean;
}

export const QrCamera: FunctionComponent<QrCamera> = ({
  // onQrData,
  disabled = false
}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const askForCameraPermission = async (): Promise<void> => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status === "granted");
  };
  useEffect(() => {
    askForCameraPermission();
  }, []);

  const onBarCodeScanned = (event: BarCodeScanningResult): void => {
    if (event.data && !disabled) {
      alert(event.data);
    }
  };

  if (hasCameraPermission === undefined || disabled) {
    return <LoadingView />;
  }
  if (!hasCameraPermission) {
    return <PermissionsRejectedView />;
  }
  return (
    <>
      <BarCodeScanner
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.code39]}
        style={{ flex: 1 }}
        onBarCodeScanned={onBarCodeScanned}
      />
    </>
  );
};
