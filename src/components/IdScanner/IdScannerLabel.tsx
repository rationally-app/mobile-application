import React, { FunctionComponent, ReactElement } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { color, fontSize, size } from "../../common/styles";
import { View, StyleSheet } from "react-native";
import { AppText } from "../Layout/AppText";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { i18nt } from "../../utils/translations";

const styles = StyleSheet.create({
  labelWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  labelText: {
    fontWeight: "bold",
    color: color("grey", 0),
    fontSize: fontSize(1)
  }
});

const getBarCodeTypeLabel = (barCodeType: string): string => {
  switch (barCodeType) {
    case BarCodeScanner.Constants.BarCodeType.qr:
      return i18nt("idScanner", "scanQRCode");
    case BarCodeScanner.Constants.BarCodeType.code39:
    default:
      return i18nt("idScanner", "scanBarcode");
  }
};

const getBarCodeTypeIcon = (barCodeType: string): ReactElement => {
  switch (barCodeType) {
    case BarCodeScanner.Constants.BarCodeType.qr:
      return (
        <AntDesign
          name="qrcode"
          size={size(3)}
          color={color("grey", 0)}
          style={{ marginRight: size(1) }}
        />
      );
    case BarCodeScanner.Constants.BarCodeType.code39:
    default:
      return (
        <Ionicons
          name="md-barcode"
          size={size(3)}
          color={color("grey", 0)}
          style={{ marginRight: size(1) }}
        />
      );
  }
};

type IdScannerLabel = {
  barCodeType: string;
};

export const IdScannerLabel: FunctionComponent<IdScannerLabel> = ({
  barCodeType
}) => {
  return (
    <View style={styles.labelWrapper}>
      {getBarCodeTypeIcon(barCodeType)}
      <AppText style={styles.labelText}>
        {getBarCodeTypeLabel(barCodeType)}
      </AppText>
    </View>
  );
};
