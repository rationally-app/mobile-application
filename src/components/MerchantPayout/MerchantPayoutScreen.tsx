import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect
} from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Vibration
} from "react-native";
import { size, color } from "../../common/styles";
import {
  withNavigationFocus,
  NavigationFocusInjectedProps
} from "react-navigation";
import { TopBackground } from "../Layout/TopBackground";
import { useConfigContext } from "../../context/config";
import { AppHeader } from "../Layout/AppHeader";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { Banner } from "../Layout/Banner";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { Card } from "../Layout/Card";
import { Credits } from "../Credits";
import { HelpModalContext } from "../../context/help";
import { VoucherInputSection } from "./VoucherInputSection";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { Feather } from "@expo/vector-icons";
import { validateMerchantCode } from "../../utils/validateMerchantCode";
import { VoucherScanner } from "../VoucherScanner/VoucherScanner";
import { BarCodeScannedCallback } from "expo-barcode-scanner";
import { validateVoucherCode } from "../../utils/validateVoucherCode";
import {
  VoucherStatus,
  VoucherStatusModal
} from "./VoucherStatusModal/VoucherStatusModal";
import { AllValidVouchersModal } from "./AllValidVouchersModal";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(2),
    paddingVertical: size(8),
    height: "100%",
    width: 512,
    maxWidth: "100%"
  },
  headerText: {
    marginBottom: size(4)
  },
  bannerWrapper: {
    marginBottom: size(1.5)
  },
  buttonsWrapper: {
    marginTop: size(5),
    flexDirection: "row",
    alignItems: "center"
  },
  submitWrapper: {
    flex: 1,
    marginRight: size(1)
  }
});

export type Voucher = {
  serial: string;
  denomination: number;
};

export const MerchantPayoutScreen: FunctionComponent<NavigationFocusInjectedProps> = ({
  navigation,
  isFocused
}) => {
  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [merchantCode, setMerchantCode] = useState("");
  const [voucherStatus, setVoucherStatus] = useState<VoucherStatus>({
    status: "VALID"
  });
  const [showAllValidVouchersModal, setShowAllValidVouchersModal] = useState(
    false
  );

  useEffect(() => {
    if (isFocused) {
      setIsScanningEnabled(true);
    }
  }, [isFocused]);

  const onCancel = (): void => {
    setVoucherStatus({
      status: "VALID"
    });
    setIsScanningEnabled(true);
  };

  const onCheckVoucher = async (input: string): Promise<void> => {
    try {
      setIsScanningEnabled(false);
      setVoucherStatus({ status: "CHECKING" });
      const serialArr = vouchers.map(voucher => voucher.serial);
      validateVoucherCode(input, serialArr);
      setVouchers([...vouchers, { serial: input, denomination: 2 }]);
      Vibration.vibrate(50);
      //TODO: Send to API -> Valid, for now timeout
      setTimeout(() => {
        console.log("Sending to API");
        setVoucherStatus({ status: "VALID" });
        setIsScanningEnabled(true);
      }, 1000);
    } catch (e) {
      setIsScanningEnabled(false);
      setVoucherStatus({
        status: "INVALID",
        errorMessage: e.message
      });
    }
  };

  const onBarCodeScanned: BarCodeScannedCallback = event => {
    if (isFocused && isScanningEnabled && event.data) {
      onCheckVoucher(event.data);
    }
  };

  const onVoucherCodeSubmit = (voucherCode: string): void => {
    if (voucherCode) {
      onCheckVoucher(voucherCode);
    } else {
      setVoucherStatus({
        status: "INVALID",
        errorMessage: "No voucher code entered",
        errorTitle: "Error during input"
      });
    }
  };

  const redeemVouchers = (): void => {
    try {
      validateMerchantCode(merchantCode);
      Vibration.vibrate(50);
      Alert.alert("Valid Merchant Code");
    } catch (e) {
      Alert.alert("Error", e.message || e, [
        {
          text: "Dismiss"
        }
      ]);
    }
  };

  const onVoucherCodeRemove = (voucherCode: string): void => {
    setVouchers(vouchers.filter(voucher => voucher.serial !== voucherCode));
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        scrollIndicatorInsets={{ right: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView behavior="position">
          <TopBackground mode={config.appMode} />
          <View style={styles.content}>
            <View style={styles.headerText}>
              <AppHeader mode={config.appMode} />
            </View>
            {messageContent && (
              <View style={styles.bannerWrapper}>
                <Banner {...messageContent} />
              </View>
            )}
            <Card>
              <VoucherInputSection
                vouchers={vouchers}
                merchantCode={merchantCode}
                setMerchantCode={setMerchantCode}
                redeemVouchers={redeemVouchers}
                openCamera={() => setShouldShowCamera(true)}
                openAllValidVouchersModal={() =>
                  setShowAllValidVouchersModal(true)
                }
              />
            </Card>
            {vouchers.length > 0 && (
              <View style={styles.buttonsWrapper}>
                <View style={styles.submitWrapper}>
                  <DarkButton
                    fullWidth={true}
                    text="Checkout"
                    icon={
                      <Feather
                        name="shopping-cart"
                        size={size(2)}
                        color={color("grey", 0)}
                      />
                    }
                    onPress={redeemVouchers}
                  />
                </View>
                <SecondaryButton
                  text="Cancel"
                  onPress={() => {
                    Alert.alert(
                      "Warning",
                      "Cancelling clears all vouchers. Are you sure?",
                      [
                        {
                          text: "No",
                          onPress: () => console.log("No Pressed")
                        },
                        {
                          text: "Yes",
                          onPress: () => {
                            setVouchers([]);
                            console.log("Yes Pressed");
                          },
                          style: "destructive"
                        }
                      ]
                    );
                  }}
                />
              </View>
            )}
            <FeatureToggler feature="HELP_MODAL">
              <HelpButton onPress={showHelpModal} />
            </FeatureToggler>
          </View>
          <AllValidVouchersModal
            vouchers={vouchers}
            isVisible={showAllValidVouchersModal}
            onVoucherCodeRemove={onVoucherCodeRemove}
            onExit={() => setShowAllValidVouchersModal(false)}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      <Credits style={{ bottom: size(3) }} />
      {shouldShowCamera && (
        <VoucherScanner
          vouchers={vouchers}
          isScanningEnabled={isScanningEnabled}
          onBarCodeScanned={onBarCodeScanned}
          onVoucherCodeSubmit={onVoucherCodeSubmit}
          onCancel={() => setShouldShowCamera(false)}
        />
      )}
      <VoucherStatusModal voucherStatus={voucherStatus} onExit={onCancel} />
    </>
  );
};

export const MerchantPayoutScreenContainer = withNavigationFocus(
  MerchantPayoutScreen
);
