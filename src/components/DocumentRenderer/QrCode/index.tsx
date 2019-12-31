import React, { FunctionComponent, useState } from "react";
import { View, ActivityIndicator, LayoutChangeEvent } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { color, size } from "../../../common/styles";

interface QrCode {
  qrCode?: string;
  qrCodeLoading?: boolean;
}

export const QrCode: FunctionComponent<QrCode> = ({
  qrCode,
  qrCodeLoading
}) => {
  const [width, setWidth] = useState(0);
  const onLayout = (event: LayoutChangeEvent): void => {
    const { width } = event.nativeEvent.layout;
    setWidth(width);
  };

  if (!qrCode && !qrCodeLoading) return null;
  if (qrCode)
    return (
      <View
        testID="qr-code"
        style={{
          margin: size(3),
          alignSelf: "stretch"
        }}
      >
        <View onLayout={onLayout}>
          <QRCode value={qrCode} size={width} />
        </View>
      </View>
    );
  return (
    <View
      testID="qr-code-loading"
      style={{
        aspectRatio: 1,
        justifyContent: "center"
      }}
    >
      <ActivityIndicator size="large" color={color("grey", 40)} />
    </View>
  );
};
