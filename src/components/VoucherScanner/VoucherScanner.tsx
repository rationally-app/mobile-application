import React, { FunctionComponent, useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from "react-native";
import * as Permissions from "expo-permissions";
import { color, size } from "../../common/styles";
import { Camera } from "../IdScanner/IdScanner";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { LoadingView } from "../Loading";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { Voucher } from "../MerchantPayout/MerchantPayoutScreen";
import { AppText } from "../Layout/AppText";
import { ValidVoucherCount } from "../MerchantPayout/ValidVoucherCount";
import { Feather } from "@expo/vector-icons";
import { ManualAddVoucherModal } from "./ManualAddVoucherModal";

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color("grey", 0)
  },
  cancelButtonWrapper: {
    flexDirection: "row",
    marginTop: size(4),
    marginBottom: size(2.5)
  },
  topSectionWrapper: {
    marginTop: size(2),
    marginBottom: size(2)
  },
  validVoucherCountWrapper: {
    alignSelf: "flex-start",
    marginHorizontal: size(3),
    marginBottom: size(2)
  },
  manualInputButtonWrapper: {
    marginRight: size(1)
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
    <SafeAreaView style={styles.containerWrapper}>
      <TouchableOpacity
        onPress={onCancel}
        style={{
          position: "absolute",
          right: size(2),
          top: size(2),
          padding: size(1)
        }}
      >
        <Feather name="x" size={size(3)} color={color("blue", 50)} />
      </TouchableOpacity>
      {vouchers.length === 0 ? (
        <View style={styles.topSectionWrapper}>
          <AppText
            style={{
              fontFamily: "brand-bold",
              paddingVertical: size(2.5)
            }}
          >
            Scan to check validity
          </AppText>
        </View>
      ) : (
        <View style={styles.validVoucherCountWrapper}>
          <ValidVoucherCount
            denomination={vouchers[0].denomination}
            numVouchers={vouchers.length}
          />
        </View>
      )}

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
      <View style={styles.cancelButtonWrapper}>
        <View style={styles.manualInputButtonWrapper}>
          <SecondaryButton
            text="Enter manually"
            onPress={() => setShowManualInput(true)}
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
  );
};
