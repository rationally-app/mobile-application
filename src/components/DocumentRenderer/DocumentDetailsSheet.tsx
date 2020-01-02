import React, {
  FunctionComponent,
  useState,
  useRef,
  useEffect,
  ReactNode
} from "react";
import {
  Animated,
  LayoutChangeEvent,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";
import { BottomSheet } from "../Layout/BottomSheet";
import { SignedDocument, getData } from "@govtechsg/open-attestation";
import QRIcon from "../../../assets/icons/qr.svg";
import { ValidityBanner } from "../Validity/ValidityBanner";
import { useDocumentVerifier } from "../../common/hooks/useDocumentVerifier";
import { CheckStatus } from "../Validity";
import { QrCode } from "./QrCode";
import { useQrGenerator } from "../../common/hooks/useQrGenerator";
import {
  color,
  size,
  fontSize,
  shadow,
  letterSpacing,
  borderRadius
} from "../../common/styles";
import { InvalidPanel } from "./InvalidPanel";
import { DocumentProperties } from "../../types";
import { DocumentMetadata } from "./DocumentMetadata";

interface BackgroundOverlay {
  isVisible: boolean;
}
const BackgroundOverlay: FunctionComponent<BackgroundOverlay> = ({
  isVisible
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 0.8 : 0,
      duration: 300
    }).start();
  }, [fadeAnim, isVisible]);

  return (
    <Animated.View
      pointerEvents={isVisible ? "auto" : "none"}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: color("grey", 100),
        opacity: fadeAnim,
        zIndex: 2
      }}
    />
  );
};

const additionalHeaderPadding = Platform.OS === "ios" ? size(7) : size(6);

const styles = StyleSheet.create({
  header: {
    paddingBottom: additionalHeaderPadding
  },
  validityBannerWrapper: {
    marginHorizontal: -size(3),
    marginBottom: size(2.5)
  },
  informationAndShareButtonWrapper: {
    flexDirection: "row"
  },
  informationWrapper: {
    flex: 1,
    marginRight: size(2)
  },
  heading: {
    fontSize: fontSize(-2),
    marginBottom: size(1),
    color: color("grey", 40)
  },
  issuerName: {
    fontSize: fontSize(-1),
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: letterSpacing(1),
    color: color("grey", 40)
  },
  shareButton: {
    backgroundColor: "white",
    minWidth: size(6),
    padding: size(1),
    borderRadius: borderRadius(3),
    justifyContent: "center",
    alignItems: "center",
    borderColor: color("grey", 15),
    borderWidth: 1,
    ...shadow(2)
  },
  shareButtonLabel: {
    marginTop: size(0.5),
    fontSize: fontSize(-4),
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: letterSpacing(1),
    color: color("grey", 40)
  },
  priorityContentBg: {
    height: "50%",
    backgroundColor: color("blue", 50),
    marginHorizontal: -size(3),
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },
  qrCodeWrapper: {
    backgroundColor: color("grey", 0),
    borderRadius: borderRadius(2),
    aspectRatio: 1,
    ...shadow(2)
  },
  contentWrapper: {
    marginHorizontal: -size(3),
    marginBottom: -size(3),
    paddingTop: size(5),
    paddingBottom: size(8),
    paddingHorizontal: size(3),
    backgroundColor: color("blue", 50),
    flexGrow: 1,
    position: "relative",
    top: -1
  },
  divider: {
    marginTop: size(6),
    backgroundColor: color("grey", 30),
    height: 2
  }
});

interface ShareButton {
  isSheetOpen: boolean;
  openSheet: () => void | null;
}
const ShareButton: FunctionComponent<ShareButton> = ({
  isSheetOpen,
  openSheet
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isAnimating, setIsAnimating] = useState(false);

  React.useEffect(() => {
    setIsAnimating(true);
    Animated.timing(fadeAnim, {
      toValue: isSheetOpen ? 0 : 1,
      duration: 300
    }).start(() => setIsAnimating(false));
  }, [fadeAnim, isSheetOpen]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim
      }}
      pointerEvents={isSheetOpen ? "none" : "auto"}
    >
      <TouchableOpacity
        onPress={openSheet}
        style={[
          styles.shareButton,
          isAnimating && {
            elevation: 0
          }
        ]}
        activeOpacity={0.9}
      >
        <View
          accessible
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <QRIcon width={size(3)} height={size(3)} />
          <Text style={styles.shareButtonLabel}>Share</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export interface DocumentDetailsSheet {
  document: DocumentProperties;
  onVerification: (checkStatus: CheckStatus) => void;
}

export const DocumentDetailsSheet: FunctionComponent<DocumentDetailsSheet> = ({
  document,
  onVerification
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { qrCode, qrCodeLoading, generateQr } = useQrGenerator();
  const [headerHeight, setHeaderHeight] = useState(0);
  const hasHeaderHeightBeenSet = useRef(false);
  const onHeaderLayout = (event: LayoutChangeEvent): void => {
    if (!hasHeaderHeightBeenSet.current) {
      const { height } = event.nativeEvent.layout;
      setHeaderHeight(height + additionalHeaderPadding);
      hasHeaderHeightBeenSet.current = true;
    }
  };

  const { issuers } = getData(document.document);
  const issuedBy =
    issuers[0]?.identityProof?.location || "Issuer's identity not found";

  const {
    tamperedCheck,
    issuedCheck,
    revokedCheck,
    issuerCheck,
    overallValidity
  } = useDocumentVerifier(document.document as SignedDocument);
  const haveChecksFinished = overallValidity !== CheckStatus.CHECKING;
  const isDocumentValid = overallValidity === CheckStatus.VALID;
  const isDocumentInvalid = overallValidity === CheckStatus.INVALID;

  useEffect(() => {
    if (haveChecksFinished) {
      onVerification(overallValidity);
    }
  }, [haveChecksFinished, onVerification, overallValidity]);

  useEffect(() => {
    // In the event that the sheet was opened before document verification completes,
    // this ensures that a qr will be generated while the sheet is opened.
    if (isDocumentValid && isSheetOpen && !qrCode && !qrCodeLoading) {
      generateQr(document.document)();
    }
  }, [
    document,
    generateQr,
    isDocumentValid,
    isSheetOpen,
    qrCode,
    qrCodeLoading
  ]);

  let priorityContent: ReactNode = null;
  if (haveChecksFinished) {
    let children: ReactNode = null;
    if (isDocumentValid) {
      children = (
        <View style={styles.qrCodeWrapper}>
          <QrCode qrCode={qrCode} qrCodeLoading={qrCodeLoading} />
        </View>
      );
    } else if (isDocumentInvalid) {
      children = <InvalidPanel />;
    }
    priorityContent = (
      <View style={{ position: "relative" }}>
        <View style={styles.priorityContentBg} />
        {children}
        <View style={styles.divider} />
      </View>
    );
  }

  return (
    <>
      <BackgroundOverlay isVisible={isSheetOpen} />
      <BottomSheet
        snapPoints={[headerHeight, "90%"]}
        onOpenStart={() => {
          if (isDocumentValid && !qrCodeLoading) {
            generateQr(document.document)();
          }
        }}
        onOpenEnd={() => setIsSheetOpen(true)}
        onCloseEnd={() => setIsSheetOpen(false)}
      >
        {openSheet => (
          <View style={{ minHeight: "100%" }}>
            <View onLayout={onHeaderLayout} style={styles.header}>
              <View style={styles.validityBannerWrapper}>
                <ValidityBanner
                  tamperedCheck={tamperedCheck}
                  issuedCheck={issuedCheck}
                  revokedCheck={revokedCheck}
                  issuerCheck={issuerCheck}
                  overallValidity={overallValidity}
                />
              </View>
              <View style={styles.informationAndShareButtonWrapper}>
                <View style={styles.informationWrapper}>
                  <Text style={styles.heading}>Issued by</Text>
                  <Text style={styles.issuerName}>{issuedBy}</Text>
                </View>
                {isDocumentValid && (
                  <ShareButton
                    isSheetOpen={isSheetOpen}
                    openSheet={openSheet}
                  />
                )}
              </View>
            </View>
            {priorityContent}
            <View style={styles.contentWrapper}>
              <DocumentMetadata document={document} />
            </View>
          </View>
        )}
      </BottomSheet>
    </>
  );
};
