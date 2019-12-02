import React, { FunctionComponent, useState, useRef } from "react";
import { LayoutChangeEvent, View, Text } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { BottomSheet } from "../Layout/BottomSheet";
import { Document, SignedDocument, getData } from "@govtechsg/open-attestation";
import QRIcon from "../../../assets/icons/qr.svg";
import { ValidityBanner } from "./ValidityBanner";
import { useDocumentVerifier } from "../../common/hooks/useDocumentVerifier";
import { VERY_LIGHT } from "../../common/colors";

interface DocumentDetailsSheet {
  document: Document;
}

export const DocumentDetailsSheet: FunctionComponent<DocumentDetailsSheet> = ({
  document
}) => {
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

  return (
    <BottomSheet snapPoints={[headerHeight, "83%"]}>
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
          <View
            style={{
              width: "100%",
              aspectRatio: 1,
              backgroundColor: VERY_LIGHT,
              marginBottom: 24
            }}
          />
        </View>
      )}
    </BottomSheet>
  );
};
