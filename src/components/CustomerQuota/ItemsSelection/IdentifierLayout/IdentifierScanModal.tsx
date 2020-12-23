import React, { FunctionComponent } from "react";
import { Modal } from "react-native";
import { IdScanner } from "../../../IdScanner/IdScanner";
import { BarCodeScannedCallback, BarCodeScanner } from "expo-barcode-scanner";
import { ScanButtonType } from "../../../../types";

export const IdentifierScanModal: FunctionComponent<{
  onScanInput: (input: string) => void;
  setShouldShowCamera: (shouldShow: boolean) => void;
  shouldShowCamera: boolean;
  type: ScanButtonType;
}> = ({ onScanInput, setShouldShowCamera, shouldShowCamera, type }) => {
  const onScan: BarCodeScannedCallback = (event) => {
    if (event.data) {
      onScanInput(event.data);
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
        barCodeTypes={[barcodeType]}
      />
    </Modal>
  );
};
