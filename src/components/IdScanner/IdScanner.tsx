import React, { FunctionComponent, useState, useEffect } from "react";
import {
  Dimensions,
  LayoutRectangle,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Camera } from "expo-camera";
import { color, size } from "../../common/styles";
import {
  BarCodeScannedCallback,
  BarCodeScanner,
  BarCodeScannerProps,
} from "expo-barcode-scanner";
import { LoadingView } from "../Loading";
import { LightBox } from "../Layout/LightBox";
import { Ionicons } from "@expo/vector-icons";
import { TransparentButton } from "../Layout/Buttons/TransparentButton";
import { IdScannerLabel } from "./IdScannerLabel";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const styles = StyleSheet.create({
  cameraWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color("grey", 100),
  },
  backButtonWrapper: {
    position: "absolute",
    marginTop: size(3),
    zIndex: Number.MAX_SAFE_INTEGER,
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  interestArea: {
    position: "absolute",
  },
});

const interestAreaRatios: Record<string, Record<string, number>> = {
  [BarCodeScanner.Constants.BarCodeType.qr]: { width: 0.7, height: 0.35 },
  [BarCodeScanner.Constants.BarCodeType.code39]: { width: 0.9, height: 0.25 },
  [BarCodeScanner.Constants.BarCodeType.code128]: { width: 0.9, height: 0.25 },
};

const getInterestAreaDimensions = (
  barCodeTypes: string[] | undefined
): LayoutRectangle => {
  const { width, height } = Dimensions.get("window");
  if (!barCodeTypes) {
    return { x: 0, y: 0, width, height };
  }

  const barCodeType = barCodeTypes[0];
  const widthRatio = interestAreaRatios[barCodeType].width;
  const heightRatio = interestAreaRatios[barCodeType].height;
  let areaWidth = width;
  let areaHeight = height;

  switch (barCodeType) {
    case BarCodeScanner.Constants.BarCodeType.qr:
      areaWidth = areaWidth * widthRatio;
      areaHeight = areaWidth;
      break;
    default:
      areaWidth = areaWidth * widthRatio;
      areaHeight = areaHeight * heightRatio;
  }

  return {
    x: (width * (1 - widthRatio)) / 2,
    y: (height * (1 - heightRatio)) / 2,
    width: areaWidth,
    height: areaHeight,
  };
};

export type IdScannerCamera = Pick<
  BarCodeScannerProps,
  "onBarCodeScanned" | "barCodeTypes"
> & {
  cancelButtonText?: string;
  onCancel?: () => void;
  interestArea?: LayoutRectangle;
  style?: StyleProp<ViewStyle>;
};

export const IdScannerCamera: FunctionComponent<IdScannerCamera> = ({
  onBarCodeScanned,
  barCodeTypes = [BarCodeScanner.Constants.BarCodeType.code39],
  interestArea,
  style,
  children,
}) => {
  return (
    <>
      {children}
      <BarCodeScanner
        barCodeTypes={barCodeTypes}
        onBarCodeScanned={onBarCodeScanned}
        style={style ?? styles.scanner}
      />
      {interestArea && (
        <LightBox
          width={interestArea.width}
          height={interestArea.height}
          label={<IdScannerLabel barCodeType={barCodeTypes[0]} />}
        />
      )}
    </>
  );
};

interface IdScanner extends IdScannerCamera {
  onCancel: () => void;
  cancelButtonText?: string;
  isScanningEnabled?: boolean;
  hasLimitedInterestArea?: boolean;
}

/**
 * A fullscreen scanner with a back button on the top left.
 * If you want a scanner that is not fullscreen, use `CustomCamera`.
 *
 * The following components are shown when `hasLimitedInterestArea` is true:
 * - Lightbox in the middle of the screen.
 * - Label on top of the lightbox with an icon and label indicating
 *    what `barCodeType` to scan.
 *
 * Scanning also only occurs within the bounds of the lightbox for Android.
 */
export const IdScanner: FunctionComponent<IdScanner> = ({
  onBarCodeScanned,
  barCodeTypes = [BarCodeScanner.Constants.BarCodeType.qr],
  onCancel,
  cancelButtonText,
  isScanningEnabled = true,
  hasLimitedInterestArea = true,
}) => {
  const [platform] = useState<string>(Platform.OS);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [interestArea] = useState<LayoutRectangle | undefined>(
    hasLimitedInterestArea ? getInterestAreaDimensions(barCodeTypes) : undefined
  );

  useEffect(() => {
    const askForCameraPermission = async (): Promise<void> => {
      const { status } = await Camera.requestPermissionsAsync();
      if (status === "granted") {
        setHasCameraPermission(true);
      } else {
        onCancel();
      }
    };

    askForCameraPermission();
  }, [onCancel]);

  const checkIfInInterestArea: BarCodeScannedCallback = (event) => {
    const bounds = event.bounds?.origin;
    if (
      bounds &&
      interestArea &&
      bounds.x >= interestArea.x &&
      bounds.y >= interestArea.y &&
      bounds.x + event.bounds.size.width <=
        interestArea.x + interestArea.width &&
      bounds.y + event.bounds.size.height <=
        interestArea.y + interestArea.height
    ) {
      onBarCodeScanned(event);
    }
  };

  const { i18nt } = useTranslate();
  const tCancelButtonText = cancelButtonText ?? i18nt("idScanner", "back");

  /**
   * We only scan codes within the lightbox if the user is using Android.
   */
  return (
    <View style={styles.cameraWrapper}>
      {hasCameraPermission && isScanningEnabled ? (
        <IdScannerCamera
          onBarCodeScanned={
            hasLimitedInterestArea && platform === "android"
              ? checkIfInInterestArea
              : onBarCodeScanned
          }
          cancelButtonText={tCancelButtonText}
          onCancel={onCancel}
          barCodeTypes={barCodeTypes}
          interestArea={interestArea}
        >
          <View style={styles.backButtonWrapper}>
            <TransparentButton
              onPress={onCancel}
              text={tCancelButtonText}
              icon={
                <Ionicons
                  name="ios-arrow-back"
                  size={size(2)}
                  color={color("grey", 0)}
                />
              }
              accessibilityLabel="id-scanner-back-button"
            />
          </View>
        </IdScannerCamera>
      ) : (
        <View style={{ flex: 1 }}>
          <LoadingView />
        </View>
      )}
    </View>
  );
};
