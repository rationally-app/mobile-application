import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import { LayoutChangeEvent, View, Text } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { BottomSheet } from "../Layout/BottomSheet";
import { Document, SignedDocument, getData } from "@govtechsg/open-attestation";
import QRIcon from "../../../assets/icons/qr.svg";
import { ValidityBanner } from "./ValidityBanner";
import { useDocumentVerifier } from "../../common/hooks/useDocumentVerifier";
import { VERY_LIGHT } from "../../common/colors";
import { CheckStatus } from "../../constants/verifier";
import { QrCode } from "./QrCode";
import { useQrGenerator } from "../../common/hooks/useQrGenerator";

export interface DocumentDetailsSheet {
  document: Document;
  onVerification: (checkStatus: CheckStatus) => void;
}

export const DocumentDetailsSheet: FunctionComponent<DocumentDetailsSheet> = ({
  document,
  onVerification
}) => {
  const { qrCode, qrCodeLoading, generateQr } = useQrGenerator();
  const [headerHeight, setHeaderHeight] = useState(0);
  const hasHeaderHeightBeenSet = useRef(false);
  const onHeaderLayout = (event: LayoutChangeEvent): void => {
    if (!hasHeaderHeightBeenSet.current) {
      const { height } = event.nativeEvent.layout;
      setHeaderHeight(height + 56);
      hasHeaderHeightBeenSet.current = true;
    }
  };

  const { issuers } = getData(document);
  const issuerName = issuers[0].name;

  const {
    tamperedCheck,
    issuedCheck,
    revokedCheck,
    issuerCheck,
    overallValidity
  } = useDocumentVerifier(document as SignedDocument);

  useEffect(() => {
    if (overallValidity !== CheckStatus.CHECKING) {
      onVerification(overallValidity);
    }
  }, [onVerification, overallValidity]);

  return (
    <BottomSheet
      snapPoints={[headerHeight, "83%"]}
      onOpenStart={generateQr(document)}
    >
      {openSheet => (
        <View testID="document-details">
          <View
            onLayout={onHeaderLayout}
            style={{
              paddingBottom: 32
            }}
          >
            <View style={{ marginHorizontal: -24, marginBottom: 20 }}>
              <ValidityBanner
                tamperedCheck={tamperedCheck}
                issuedCheck={issuedCheck}
                revokedCheck={revokedCheck}
                issuerCheck={issuerCheck}
                overallValidity={overallValidity}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, marginBottom: 8 }}>Issued by</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: 0.5
                  }}
                >
                  {issuerName}
                </Text>
              </View>
              <RectButton
                onPress={openSheet}
                style={{
                  backgroundColor: VERY_LIGHT,
                  height: 48,
                  width: 48,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View accessible>
                  <QRIcon width={24} height={24} />
                </View>
              </RectButton>
            </View>
          </View>
          <QrCode qrCode={qrCode} qrCodeLoading={qrCodeLoading} />
        </View>
      )}
    </BottomSheet>
  );
};
