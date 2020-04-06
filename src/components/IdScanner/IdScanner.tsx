import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { color, size } from "../../common/styles";
import { BarCodeScanner, BarCodeScannerProps } from "expo-barcode-scanner";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";

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

type Camera = Pick<BarCodeScannerProps, "onBarCodeScanned" | "barCodeTypes">;

const Camera: FunctionComponent<Camera> = ({
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
}

export const IdScanner: FunctionComponent<IdScanner> = ({
  onBarCodeScanned,
  barCodeTypes,
  onCancel,
  cancelButtonText
}) => (
  <View style={styles.cameraWrapper}>
    <Camera onBarCodeScanned={onBarCodeScanned} barCodeTypes={barCodeTypes} />
    <View style={styles.cancelButtonWrapper}>
      <SecondaryButton text={cancelButtonText} onPress={onCancel} />
    </View>
  </View>
);
