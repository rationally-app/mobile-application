import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import {
  View,
  Platform,
  Text,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
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
  onQrData: (data: string) => void;
  disabled?: boolean;
}

export const QrCamera: FunctionComponent<QrCamera> = ({
  onQrData,
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
      onQrData(event.data);
    }
  };

  const cameraRef = useRef<Camera>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [ratio, setRatio] = useState();
  const onCameraReady = async (): Promise<void> => {
    if (Platform.OS === "android" && cameraRef.current) {
      const ratios = await cameraRef.current.getSupportedRatiosAsync();
      setRatio(ratios[ratios.length - 1]);
    }
    setIsCameraReady(true);
  };

  if (hasCameraPermission === undefined || disabled) {
    return <LoadingView />;
  }
  if (!hasCameraPermission) {
    return <PermissionsRejectedView />;
  }
  return (
    <>
      {!isCameraReady && <LoadingView />}
      <Camera
        ref={cameraRef}
        style={{ flex: isCameraReady ? 1 : 0 }}
        onBarCodeScanned={onBarCodeScanned}
        onCameraReady={onCameraReady}
        ratio={ratio}
        testID="qr-camera"
      />
    </>
  );
};
