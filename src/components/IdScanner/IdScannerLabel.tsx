import React, { FunctionComponent, ReactElement } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { color, size } from "../../common/styles";
import { View, StyleSheet } from "react-native";
import { AppText } from "../Layout/AppText";
import { Ionicons, AntDesign } from "@expo/vector-icons";

// TODO: Add translations for these
const barCodeTypeLabels: Record<string, string> = {
  [BarCodeScanner.Constants.BarCodeType.qr]: "Scan QR code",
  [BarCodeScanner.Constants.BarCodeType.code39]: "Scan Barcode"
};

const barCodeTypeIcons: Record<string, ReactElement> = {
  [BarCodeScanner.Constants.BarCodeType.qr]: (
    <AntDesign
      name="qrcode"
      size={size(2)}
      color={color("grey", 0)}
      style={{ marginRight: size(1) }}
    />
  ),
  [BarCodeScanner.Constants.BarCodeType.code39]: (
    <Ionicons
      name="md-barcode"
      size={size(2)}
      color={color("grey", 0)}
      style={{ marginRight: size(1) }}
    />
  )
};

const styles = StyleSheet.create({
  labelWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  labelText: {
    fontWeight: "bold",
    color: color("grey", 0)
  }
});

type IdScannerLabel = {
  interestAreaHeight: number;
  barCodeType: string;
};

export const IdScannerLabel: FunctionComponent<IdScannerLabel> = ({
  barCodeType
}) => {
  return (
    <View style={styles.labelWrapper}>
      {barCodeTypeIcons[barCodeType]}
      <AppText style={styles.labelWrapper}>
        {barCodeTypeLabels[barCodeType]}
      </AppText>
    </View>
  );
};
