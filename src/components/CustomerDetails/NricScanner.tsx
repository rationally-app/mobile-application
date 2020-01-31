import React, { FunctionComponent } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { color } from "../../common/styles";

export interface BarCodeScanningResult {
  type: string;
  data: string;
}

interface NricScanner {
  onBarCodeScanned: (event: BarCodeScanningResult) => void;
  barCodeTypes?: string[];
}

export const NricScanner: FunctionComponent<NricScanner> = ({
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
