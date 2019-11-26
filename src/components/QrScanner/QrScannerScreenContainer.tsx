import React, { FunctionComponent, useState } from "react";
import { View } from "react-native";
import { NavigationProps } from "../../types";
import { Header } from "../Layout/Header";
import { ScreenView } from "../ScreenView";
import { QrCamera } from "./QrCamera";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { processQr } from "../../services/QrProcessor";
import { Document } from "@govtechsg/open-attestation";

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
        <Header goBack={navigation.goBack} />
        <QrCamera onQrData={onQrData} disabled={scanningDisabled} />
        <View
          style={{
            alignItems: "center",
            margin: 24
          }}
        >
          <DarkButton text="Cancel" onPress={navigation.goBack} />
        </View>
      </View>
    </ScreenView>
  );
};
