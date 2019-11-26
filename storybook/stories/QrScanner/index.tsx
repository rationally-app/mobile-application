import React from "react";
import { storiesOf } from "@storybook/react-native";
import { QrScannerScreenContainer } from "../../../src/components/QrScanner/QrScannerScreenContainer";

const mockNavigate = (...options: any): boolean => {
  alert(JSON.stringify(options));
  return true;
};

const navigation: any = {
  navigate: mockNavigate,
  goBack: () => alert("Back")
};

storiesOf("QrScanner", module).add("QrScannerScreenContainer", () => (
  <QrScannerScreenContainer navigation={navigation} />
));
