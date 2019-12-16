import React, { FunctionComponent } from "react";
import { View, ActivityIndicator } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { DARK, VERY_LIGHT } from "../../../common/colors";

const QR_CODE_SIZE = 250;

interface QrCode {
  qrCode?: string;
  qrCodeLoading?: boolean;
}

export const QrCode: FunctionComponent<QrCode> = ({
  qrCode,
  qrCodeLoading
}) => {
  if (!qrCode && !qrCodeLoading) return null;
  if (qrCode)
    return (
      <View
        testID="qr-code"
        style={{
          marginVertical: 24,
          width: "100%",
          alignItems: "center"
        }}
      >
        <QRCode value={qrCode} size={QR_CODE_SIZE} />
      </View>
    );
  return (
    <View
      testID="qr-code-loading"
      style={{
        width: "100%",
        marginVertical: 24,
        alignItems: "center"
      }}
    >
      <View
        style={{
          width: QR_CODE_SIZE,
          aspectRatio: 1,
          backgroundColor: VERY_LIGHT,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <ActivityIndicator size="large" color={DARK} />
      </View>
    </View>
  );
};
