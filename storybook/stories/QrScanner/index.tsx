import React from "react";
import { storiesOf } from "@storybook/react-native";
import { QrScannerScreenContainer } from "../../../src/components/QrScanner/QrScannerScreenContainer";
import { navigation } from "../mocks/navigation";

storiesOf("QrScanner", module).add("QrScannerScreenContainer", () => (
  <QrScannerScreenContainer navigation={navigation} />
));
