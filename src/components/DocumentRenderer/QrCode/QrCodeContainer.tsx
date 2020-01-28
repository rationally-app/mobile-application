import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useCallback
} from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  color,
  borderRadius,
  shadow,
  size,
  fontSize
} from "../../../common/styles";
import { QrCode } from "./QrCode";
import { DocumentProperties, DocumentObject } from "../../../types";
import { useQrGenerator } from "../../../common/hooks/useQrGenerator";
import { useNetworkContext } from "../../../context/network";
import HumanizeDuration from "humanize-duration";
import { useCountdown } from "../../../common/hooks/useCountdown";

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: color("grey", 0),
    borderRadius: borderRadius(2),
    ...shadow(2)
  },
  qrCodeWrapper: {
    aspectRatio: 1
  },
  expiryText: {
    fontSize: fontSize(-3),
    marginHorizontal: size(3),
    marginBottom: size(2),
    textAlign: "center"
  },
  offlineBanner: {
    backgroundColor: color("red", 10),
    paddingVertical: size(2),
    paddingHorizontal: size(3),
    borderRadius: borderRadius(2),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  offlineBannerHeader: {
    fontSize: fontSize(-2),
    color: color("red", 30),
    fontWeight: "bold",
    marginBottom: size(0.5)
  },
  offlineBannerText: {
    fontSize: fontSize(-3),
    color: color("red", 30)
  }
});

const updateDocumentQr = async (
  qrCode: { url: string; expiry?: number },
  document: { atomicUpdate: DocumentObject["atomicUpdate"] }
): Promise<void> => {
  const updateFunction = (oldData: DocumentProperties): DocumentProperties => {
    oldData.qrCode = { ...qrCode };
    return oldData;
  };
  await document?.atomicUpdate(updateFunction);
};

export interface QrCodeContainerRef {
  triggerGenerateQr: () => void;
}

interface QrCodeContainer {
  document: DocumentProperties & Pick<DocumentObject, "atomicUpdate">;
  refreshPaused: boolean;
}

// eslint-disable-next-line react/display-name
export const QrCodeContainer = forwardRef<QrCodeContainerRef, QrCodeContainer>(
  ({ document, refreshPaused }, ref) => {
    const { isConnected } = useNetworkContext();

    const { qrCode, qrCodeLoading, generateQr } = useQrGenerator(
      document.qrCode
    );

    // Updates the stored QR code in the DB
    useEffect(() => {
      updateDocumentQr(qrCode, document);
    }, [qrCode, document]);

    const { secondsLeft, startCountdown } = useCountdown();

    // Starts the countdown based on the expiry of the QR code
    useEffect(() => {
      if (qrCode.expiry !== undefined) {
        startCountdown(Math.round((qrCode.expiry - Date.now()) / 1000));
      }
    }, [qrCode.expiry, startCountdown]);

    // Attempts to generate QR
    const triggerGenerateQr = useCallback((): void => {
      if (isConnected && !qrCodeLoading && !refreshPaused) {
        generateQr(document.document);
      }
    }, [
      document.document,
      generateQr,
      isConnected,
      qrCodeLoading,
      refreshPaused
    ]);

    // Triggers a refresh whenever the QR expires or when the user comes online
    useEffect(() => {
      if (secondsLeft === 0 && isConnected) {
        triggerGenerateQr();
      }
    }, [isConnected, qrCodeLoading, secondsLeft, triggerGenerateQr]);

    useImperativeHandle(ref, () => ({ triggerGenerateQr }));
    return (
      <View style={styles.wrapper}>
        <View style={styles.qrCodeWrapper}>
          <QrCode qrCode={qrCode.url} qrCodeLoading={qrCodeLoading} />
        </View>
        <View style={{ marginTop: qrCode.expiry ? -size(2) : 0 }}>
          {qrCode.expiry && !qrCodeLoading && (
            <Text style={styles.expiryText}>
              {secondsLeft !== undefined && secondsLeft > 0
                ? `Expires in ${HumanizeDuration(secondsLeft * 1000, {
                    round: true
                  })}`
                : `Expired`}
            </Text>
          )}
          {!isConnected && (
            <View style={styles.offlineBanner} testID="offline-banner">
              <Text style={styles.offlineBannerHeader}>
                You&apos;re offline!
              </Text>
              <Text style={styles.offlineBannerText}>
                The QR code can only refresh when you are back online
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
);
