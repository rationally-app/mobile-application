import React, { FunctionComponent } from "react";
import { Modal } from "react-native";
import { IdScanner } from "../../../IdScanner/IdScanner";
import { BarCodeScannedCallback, BarCodeScanner } from "expo-barcode-scanner";
import { ScanButtonType } from "../../../../types";
import { validateBarcode } from "./validateBarcode";

export const IdentifierScanModal: FunctionComponent<{
  cancelButtonText: string;
  onScanInput: (input: string) => void;
  setShouldShowCamera: (shouldShow: boolean) => void;
  shouldShowCamera: boolean;
  type: ScanButtonType;
}> = ({
  cancelButtonText,
  onScanInput,
  setShouldShowCamera,
  shouldShowCamera,
  type
}) => {
  const onScan: BarCodeScannedCallback = event => {
    if (event.data) {
      if (validateBarcode(event.data)) {
        onScanInput(event.data);
      } else {
        alert("Invalid code");
        setShouldShowCamera(false);
      }
    }
  };

  const barcodeType =
    type === "BARCODE"
      ? BarCodeScanner.Constants.BarCodeType.code39
      : BarCodeScanner.Constants.BarCodeType.qr;

  return (
    <Modal
      visible={shouldShowCamera}
      onRequestClose={() => setShouldShowCamera(false)}
      transparent={true}
      animationType="slide"
    >
      <IdScanner
        onBarCodeScanned={onScan}
        onCancel={() => setShouldShowCamera(false)}
        cancelButtonText={cancelButtonText}
        barCodeTypes={[barcodeType]}
      />
    </Modal>
  );
};
