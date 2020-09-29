import React, { FunctionComponent, useState, useEffect } from "react";
import { Dimensions, LayoutRectangle, StyleSheet, View } from "react-native";
import * as Permissions from "expo-permissions";
import { color } from "../../common/styles";
import { BarCodeScannedCallback, BarCodeScanner } from "expo-barcode-scanner";
import { LoadingView } from "../Loading";
import { LightBox } from "../LightBox/LightBox";

const styles = StyleSheet.create({
  cameraWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color("grey", 100)
  },
  scanner: {
    ...StyleSheet.absoluteFillObject
  },
  interestArea: {
    position: "absolute"
  }
});

export type Camera = {
  onBarCodeScanned: BarCodeScannedCallback;
  barCodeTypes: string[];
  limitInterestArea?: boolean;
  interestAreaWidth?: number;
  interestAreaHeight?: number;
  updateInterestArea?: (newInterestArea: LayoutRectangle) => void;
};

export const Camera: FunctionComponent<Camera> = ({
  onBarCodeScanned,
  barCodeTypes = [BarCodeScanner.Constants.BarCodeType.code39],
  limitInterestArea,
  interestAreaWidth,
  interestAreaHeight,
  updateInterestArea
}) => {
  return (
    <BarCodeScanner
      barCodeTypes={barCodeTypes}
      onBarCodeScanned={onBarCodeScanned}
      style={styles.scanner}
    >
      {limitInterestArea &&
        updateInterestArea &&
        interestAreaWidth &&
        interestAreaHeight && (
          <LightBox width={interestAreaWidth} height={interestAreaHeight}>
            <View
              style={{
                position: "absolute",
                width: interestAreaWidth,
                height: interestAreaHeight
              }}
              onLayout={e => updateInterestArea(e.nativeEvent.layout)}
            />
          </LightBox>
        )}
    </BarCodeScanner>
  );
};

const interestAreaDimensions: Record<string, Record<string, number>> = {
  [BarCodeScanner.Constants.BarCodeType.qr]: { width: 0.7, height: 0.35 },
  [BarCodeScanner.Constants.BarCodeType.code39]: { width: 0.9, height: 0.2 }
};

const getMaxInterestAreaDimensions = (
  barCodeTypes: string[]
): Record<string, number> => {
  let maxWidth = 0;
  let maxHeight = 0;

  barCodeTypes.forEach(type => {
    const width = interestAreaDimensions[type].width;
    const height = interestAreaDimensions[type].height;

    maxWidth = Math.max(maxWidth, width);
    maxHeight = Math.max(maxHeight, height);
  });

  return { width: maxWidth, height: maxHeight };
};

interface IdScanner extends Camera {
  onCancel: () => void;
  cancelButtonText: string;
  isScanningEnabled?: boolean;
}

export const IdScanner: FunctionComponent<IdScanner> = ({
  onBarCodeScanned,
  barCodeTypes,
  onCancel,
  // TODO: Make use of "cancelButtonText" for Back Button
  cancelButtonText,
  isScanningEnabled = true,
  // TOOD: Determine best default value for this: true is non-breaking, false is breaking
  limitInterestArea = true
}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const { width, height } = Dimensions.get("window");
  const interestAreaDimensions = getMaxInterestAreaDimensions(barCodeTypes);
  const interestAreaWidth = width * interestAreaDimensions.width;
  const interestAreaHeight = height * interestAreaDimensions.height;
  const [interestArea, setInterestArea] = useState<LayoutRectangle>();

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
    if (
      event.bounds &&
      interestArea &&
      event.bounds.origin.x >= interestArea.x &&
      event.bounds.origin.y >= interestArea.y &&
      event.bounds.origin.x + event.bounds.size.width <=
        interestArea.x + interestArea.width &&
      event.bounds.origin.y + event.bounds.size.height <=
        interestArea.y + interestArea.height
    ) {
      onBarCodeScanned(event);
    }
  };

  const updateInterestArea = (newInterestArea: LayoutRectangle) => {
    setInterestArea(newInterestArea);
  };

  return (
    <View style={styles.cameraWrapper}>
      {hasCameraPermission && isScanningEnabled ? (
        <Camera
          onBarCodeScanned={
            limitInterestArea ? checkIfInInterestArea : onBarCodeScanned
          }
          barCodeTypes={barCodeTypes}
          limitInterestArea={limitInterestArea}
          interestAreaWidth={interestAreaWidth}
          interestAreaHeight={interestAreaHeight}
          updateInterestArea={updateInterestArea}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <LoadingView />
        </View>
      )}
    </View>
  );
};
