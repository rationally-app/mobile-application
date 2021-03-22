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

  let barcodeType = BarCodeScanner.Constants.BarCodeType.qr;
  if (type === "CODE_128")
    barcodeType = BarCodeScanner.Constants.BarCodeType.code128;
  else if (type === "CODE_39")
    barcodeType = BarCodeScanner.Constants.BarCodeType.code39;
  // the idea is to drop the BARCODE type after we have updated this to prod
  // without creating breaking changes, hence we currently support both types
  else if (type === "BARCODE")
    barcodeType = BarCodeScanner.Constants.BarCodeType.code39;

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
