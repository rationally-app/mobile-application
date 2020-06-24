import React, { FunctionComponent, useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import * as Permissions from "expo-permissions";
import { color, size } from "../../common/styles";
import { Camera } from "../IdScanner/IdScanner";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { LoadingView } from "../Loading";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { AppText } from "../Layout/AppText";
import { ValidVoucherCount } from "../MerchantPayout/ValidVoucherCount";
import { Feather } from "@expo/vector-icons";
import { ManualAddVoucherModal } from "./ManualAddVoucherModal";
import { SafeAreaView } from "react-navigation";
import { Voucher } from "../../types";

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color("grey", 0)
  },
  content: {
    flex: 1
  },
  topSectionWrapper: {
    marginTop: size(1),
    marginBottom: size(3),
    marginHorizontal: size(2),
    alignItems: "flex-start"
  },
  closeButton: {
    position: "absolute",
    right: -size(1),
    top: -size(1),
    padding: size(1)
  },
  bottomSectionWrapper: {
    flexDirection: "row",
    marginVertical: size(3),
    marginHorizontal: size(2),
    maxWidth: 512,
    alignSelf: "center"
  },
  manualInputButtonWrapper: {
    marginRight: size(1),
    flexGrow: 1
  }
});

interface VoucherScanner extends Camera {
  onCancel: () => void;
  onVoucherCodeSubmit: (input: string) => void;
  isScanningEnabled?: boolean;
  vouchers: Voucher[];
}

export const VoucherScanner: FunctionComponent<VoucherScanner> = ({
  vouchers,
  onBarCodeScanned,
  onVoucherCodeSubmit,
  barCodeTypes,
  onCancel,
  isScanningEnabled = true
}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
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

  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.content}>
        <View style={styles.topSectionWrapper}>
          {vouchers.length === 0 ? (
            <AppText
              style={{
                fontFamily: "brand-bold"
              }}
            >
              Scan to check validity
            </AppText>
          ) : (
            <ValidVoucherCount
              denomination={vouchers[0].denomination}
              numVouchers={vouchers.length}
            />
          )}
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <Feather name="x" size={size(3)} color={color("blue", 50)} />
          </TouchableOpacity>
        </View>

        {hasCameraPermission ? (
          <Camera
            onBarCodeScanned={isScanningEnabled ? onBarCodeScanned : () => null}
            barCodeTypes={barCodeTypes}
          />
        ) : (
          <View style={{ flex: 1 }}>
            <LoadingView />
          </View>
        )}
        <View style={styles.bottomSectionWrapper}>
          <View style={styles.manualInputButtonWrapper}>
            <SecondaryButton
              text="Enter manually"
              onPress={() => setShowManualInput(true)}
              fullWidth={true}
            />
          </View>
          <DarkButton text="Complete" onPress={onCancel} />
        </View>
        <ManualAddVoucherModal
          isVisible={showManualInput}
          onExit={() => setShowManualInput(false)}
          onVoucherCodeSubmit={onVoucherCodeSubmit}
        />
      </SafeAreaView>
    </View>
  );
};
