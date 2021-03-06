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

  let barcodeType;
  switch (type) {
    case "CODE_128":
      barcodeType = BarCodeScanner.Constants.BarCodeType.code128;
      break;
    // the idea is to drop the BARCODE type after we have updated this to prod
    // without creating breaking changes, hence we currently support both types
    case "CODE_39":
    case "BARCODE":
      barcodeType = BarCodeScanner.Constants.BarCodeType.code39;
      break;
    default:
      barcodeType = BarCodeScanner.Constants.BarCodeType.qr;
      break;
  }

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
