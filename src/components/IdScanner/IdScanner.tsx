import React, { FunctionComponent, useState, useEffect } from "react";
import {
  Dimensions,
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import * as Permissions from "expo-permissions";
import { color, size } from "../../common/styles";
import {
  BarCodeScannedCallback,
  BarCodeScanner,
  BarCodeScannerProps
} from "expo-barcode-scanner";
import { LoadingView } from "../Loading";
import { LightBox } from "../Layout/LightBox";
import { Ionicons } from "@expo/vector-icons";
import { TransparentButton } from "../Layout/Buttons/TransparentButton";
import { IdScannerLabel } from "./IdScannerLabel";
import { i18nt } from "../../utils/translations";

const styles = StyleSheet.create({
  cameraWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color("grey", 100)
  },
  backButtonWrapper: {
    marginTop: size(3)
  },
  scanner: {
    ...StyleSheet.absoluteFillObject
  },
  interestArea: {
    position: "absolute"
  }
});

const interestAreaRatios: Record<string, Record<string, number>> = {
  [BarCodeScanner.Constants.BarCodeType.qr]: { width: 0.7, height: 0.35 },
  [BarCodeScanner.Constants.BarCodeType.code39]: { width: 0.9, height: 0.25 }
};

const getInterestAreaDimensions = (
  barCodeTypes: string[] | undefined
): LayoutRectangle => {
  const { width, height } = Dimensions.get("window");
  if (!barCodeTypes) {
    return { x: 0, y: 0, width, height };
  }
  let maxWidthRatio = 0;
  let maxHeightRatio = 0;
  barCodeTypes.forEach(type => {
    maxWidthRatio = Math.max(maxWidthRatio, interestAreaRatios[type].width);
    maxHeightRatio = Math.max(maxHeightRatio, interestAreaRatios[type].height);
  });
  return {
    x: (width * (1 - maxWidthRatio)) / 2,
    y: (height * (1 - maxHeightRatio)) / 2,
    width: width * maxWidthRatio,
    height: height * maxHeightRatio
  };
};

export type Camera = Pick<
  BarCodeScannerProps,
  "onBarCodeScanned" | "barCodeTypes"
> & {
  cancelButtonText?: string;
  onCancel?: () => void;
  interestAreaLayout?: LayoutRectangle;
  style?: StyleProp<ViewStyle>;
};

export const Camera: FunctionComponent<Camera> = ({
  onBarCodeScanned,
  barCodeTypes = [BarCodeScanner.Constants.BarCodeType.code39],
  children,
  interestAreaLayout,
  style
}) => {
  return (
    <BarCodeScanner
      barCodeTypes={barCodeTypes}
      onBarCodeScanned={onBarCodeScanned}
      style={style ?? styles.scanner}
    >
      {children}
      {interestAreaLayout && (
        <LightBox
          width={interestAreaLayout.width}
          height={interestAreaLayout.height}
          label={<IdScannerLabel barCodeType={barCodeTypes[0]} />}
        />
      )}
    </BarCodeScanner>
  );
};

interface IdScanner extends Camera {
  onCancel: () => void;
  cancelButtonText?: string;
  isScanningEnabled?: boolean;
  hasLimitedInterestArea?: boolean;
}

/**
 * A fullscreen scanner with a back button on the top left.
 * If you want a scanner that is not fullscreen, use `Camera`.
 *
 * The following components are shown when `hasLimitedInterestArea` is true:
 * - Lightbox in the middle of the screen.
 * - Label on top of the lightbox with an icon and label indicating
 *    what `barCodeType` to scan.
 *
 * Scanning also only occurs within the bounds of the lightbox.
 */
export const IdScanner: FunctionComponent<IdScanner> = ({
  onBarCodeScanned,
  barCodeTypes = [BarCodeScanner.Constants.BarCodeType.qr],
  onCancel,
  cancelButtonText = i18nt("idScanner", "back"),
  isScanningEnabled = true,
  hasLimitedInterestArea = true
}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const interestAreaLayout = hasLimitedInterestArea
    ? getInterestAreaDimensions(barCodeTypes)
    : undefined;
  const [interestArea] = useState<LayoutRectangle | undefined>(
    interestAreaLayout
  );

  useEffect(() => {
    const askForCameraPermission = async (): Promise<void> => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status === "granted") {
        setHasCameraPermission(true);
      } else {
        onCancel();
      }
    };

    askForCameraPermission();
  }, [onCancel]);

  const checkIfInInterestArea: BarCodeScannedCallback = event => {
    /**
     * An issue exists in Expo where `BarCodeScanner.BarCodeBounds`
     * may not be returned for iOS devices, in such cases, we allow
     * scanning anywhere on the camera, rather than within the lightbox.
     */
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
    } else {
      onBarCodeScanned(event);
    }
  };

  return (
    <View style={styles.cameraWrapper}>
      {hasCameraPermission && isScanningEnabled ? (
        <Camera
          onBarCodeScanned={
            hasLimitedInterestArea ? checkIfInInterestArea : onBarCodeScanned
          }
          barCodeTypes={barCodeTypes}
          interestAreaLayout={interestAreaLayout}
        >
          <View style={styles.backButtonWrapper}>
            <TransparentButton
              onPress={onCancel}
              text={cancelButtonText}
              icon={
                <Ionicons
                  name="ios-arrow-back"
                  size={size(2)}
                  color={color("grey", 0)}
                />
              }
            />
          </View>
        </Camera>
      ) : (
        <View style={{ flex: 1 }}>
          <LoadingView />
        </View>
      )}
    </View>
  );
};
