import React, { FunctionComponent } from "react";
import { NavigationProps } from "../../types";
import { QrScannerScreenContainer } from "../../components/QrScanner/QrScannerScreenContainer";

const QrScannerScreen: FunctionComponent<NavigationProps> = ({
  navigation
}: NavigationProps) => {
  return <QrScannerScreenContainer navigation={navigation} />;
};

export default QrScannerScreen;
