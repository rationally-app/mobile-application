import React, { FunctionComponent } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { color } from "../../common/styles";

export interface BarCodeScanningResult {
  type: string;
  data: string;
}

interface NricScanner {
  onBarCodeScanned: (event: BarCodeScanningResult) => void;
}

export const NricScanner: FunctionComponent<NricScanner> = ({
  onBarCodeScanned
}) => (
  <BarCodeScanner
    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.code39]}
    style={{
      flex: 1,
      backgroundColor: color("grey", 0),
      width: "100%"
    }}
    onBarCodeScanned={onBarCodeScanned}
  />
);
