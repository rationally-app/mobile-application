import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import { View, Platform } from "react-native";
import { LoadingView } from "../Loading";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";

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
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const askForCameraPermission = async (): Promise<void> => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status === "granted");
  };
  const onBarCodeScanned = (event: BarCodeScanningResult): void => {
    if (event.data && !disabled) {
      onQrData(event.data);
    }
  };
  useEffect(() => {
    askForCameraPermission();
  }, []);

  const cameraRef = useRef<Camera>(null);
  const [ratio, setRatio] = useState();
  const onCameraReady = async (): Promise<void> => {
    if (Platform.OS === "android" && cameraRef.current) {
      const ratios = await cameraRef.current.getSupportedRatiosAsync();
      setRatio(ratios[ratios.length - 1]);
    }
  };

  return hasCameraPermission ? (
    <View style={{ flex: 1 }}>
      {disabled ? (
        <View style={{ width: "100%", height: "100%", position: "absolute" }}>
          <LoadingView />
        </View>
      ) : (
        <Camera
          ref={cameraRef}
          style={{ flex: 1 }}
          onBarCodeScanned={onBarCodeScanned}
          onCameraReady={onCameraReady}
          ratio={ratio}
          testID="qr-camera"
        />
      )}
    </View>
  ) : null;
};
