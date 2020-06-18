import React, { FunctionComponent, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as Permissions from "expo-permissions";
import { color, size } from "../../common/styles";
import { BarCodeScanner, BarCodeScannerProps } from "expo-barcode-scanner";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { LoadingView } from "../Loading";

const styles = StyleSheet.create({
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
  }
});

export type Camera = Pick<
  BarCodeScannerProps,
  "onBarCodeScanned" | "barCodeTypes"
>;

export const Camera: FunctionComponent<Camera> = ({
  onBarCodeScanned,
  barCodeTypes = [BarCodeScanner.Constants.BarCodeType.code39]
}) => (
  <BarCodeScanner
    barCodeTypes={barCodeTypes}
    style={{
      flex: 1,
      backgroundColor: color("grey", 0),
      width: "100%"
    }}
    onBarCodeScanned={onBarCodeScanned}
  />
);

interface IdScanner extends Camera {
  onCancel: () => void;
  cancelButtonText: string;
  isScanningEnabled?: boolean;
}

export const IdScanner: FunctionComponent<IdScanner> = ({
  onBarCodeScanned,
  barCodeTypes,
  onCancel,
  cancelButtonText,
  isScanningEnabled = true
}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  useEffect(() => {
    const askForCameraPermission = async (): Promise<void> => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status === "granted") {
        setHasCameraPermission(true);
      } else {
        onCancel();
      }
    };

    askForCameraPermission();
  }, [onCancel]);

  return (
    <View style={styles.cameraWrapper}>
      {hasCameraPermission && isScanningEnabled ? (
        <Camera
          onBarCodeScanned={onBarCodeScanned}
          barCodeTypes={barCodeTypes}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <LoadingView />
        </View>
      )}
      <View style={styles.cancelButtonWrapper}>
        <SecondaryButton text={cancelButtonText} onPress={onCancel} />
      </View>
    </View>
  );
};
