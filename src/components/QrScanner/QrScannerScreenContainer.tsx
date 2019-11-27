import React, { FunctionComponent, useState } from "react";
import { View } from "react-native";
import { NavigationProps } from "../../types";
import { ScreenView } from "../ScreenView";
import { QrCamera } from "./QrCamera";
import { processQr } from "../../services/QrProcessor";
import { Document } from "@govtechsg/open-attestation";
import { BottomNav } from "../Layout/BottomNav";

export interface QrScannerScreenContainer {
  navigation: NavigationProps["navigation"];
}

export const QrScannerScreenContainer: FunctionComponent<QrScannerScreenContainer> = ({
  navigation
}) => {
  const [scanningDisabled, setScanningDisabled] = useState(false);
  const onDocumentStore = (document: Document): void => {
    navigation.navigate("ScannedDocumentScreen", {
      document,
      storeDocument: true
    });
  };
  const onDocumentView = (document: Document): void => {
    navigation.navigate("ScannedDocumentScreen", { document });
  };
  const onQrData = async (data: string): Promise<void> => {
    setScanningDisabled(true);
    try {
      await processQr(data, { onDocumentStore, onDocumentView });
    } catch (e) {
      alert(e);
    }
    setScanningDisabled(false);
  };

  return (
    <ScreenView>
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "space-between"
        }}
      >
        <QrCamera onQrData={onQrData} disabled={scanningDisabled} />
        <BottomNav navigation={navigation} />
      </View>
    </ScreenView>
  );
};
