import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Vibration,
  BackHandler,
  Platform
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
import { HelpModalContext } from "../../context/help";
import { VoucherInputSection } from "./VoucherInputSection";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { Feather } from "@expo/vector-icons";
import { VoucherScanner } from "../VoucherScanner/VoucherScanner";
import { BarCodeScannedCallback } from "expo-barcode-scanner";
import { VoucherStatusModal } from "./VoucherStatusModal/VoucherStatusModal";
import { AllValidVouchersModal } from "./AllValidVouchersModal";
import { useVoucher } from "../../hooks/useVoucher";
import { useCheckVoucherValidity } from "../../hooks/useCheckVoucherValidity";
import { useAuthenticationContext } from "../../context/auth";

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

export const MerchantPayoutScreen: FunctionComponent<NavigationFocusInjectedProps> = ({
  navigation,
  isFocused
}) => {
  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const [merchantCode, setMerchantCode] = useState("");
  const [showAllValidVouchersModal, setShowAllValidVouchersModal] = useState(
    false
  );
  const { token, endpoint } = useAuthenticationContext();

  const {
    voucherState,
    vouchers,
    addVoucher,
    removeVoucher,
    checkoutMerchantCode,
    checkoutResult,
    error: merchantError,
    clearError,
    resetState
  } = useVoucher(token, endpoint);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (shouldShowCamera) {
          setShouldShowCamera(false);
          return true;
        }
        return false;
      }
    );
    return () => {
      backHandler.remove();
    };
  }, [shouldShowCamera]);

  useEffect(() => {
    if (isFocused) {
      setIsScanningEnabled(true);
    }
  }, [isFocused]);

  const {
    checkValidityState,
    checkValidity,
    validityResult,
    error: validityError,
    resetValidityState
  } = useCheckVoucherValidity(token, endpoint);

  const onCheckVoucher = async (input: string): Promise<void> => {
    setIsScanningEnabled(false);
    checkValidity(input, vouchers);
  };

  const onModalExit = useCallback((): void => {
    resetValidityState();
    setIsScanningEnabled(true);
  }, [resetValidityState]);

  // Detect if a voucher code has been validated
  useEffect(() => {
    if (
      isFocused &&
      checkValidityState === "RESULT_RETURNED" &&
      validityResult
    ) {
      addVoucher(validityResult);
      Vibration.vibrate(50);
      onModalExit();
    }
  }, [isFocused, checkValidityState, validityResult, onModalExit, addVoucher]);

  const onBarCodeScanned: BarCodeScannedCallback = event => {
    if (isScanningEnabled && event.data) {
      onCheckVoucher(event.data);
    }
  };

  const redeemVouchers = (): void => {
    checkoutMerchantCode(merchantCode);
  };

  // Detect submission of merchant code
  useEffect(() => {
    if (voucherState === "RESULT_RETURNED" && checkoutResult) {
      console.log(checkoutResult);
      Vibration.vibrate(50);
    } else if (merchantError) {
      Alert.alert("Error", merchantError.message, [
        {
          text: "Dismiss",
          onPress: () => clearError()
        }
      ]);
    }
  }, [voucherState, merchantError, clearError, checkoutResult]);

  return (
    <>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        scrollIndicatorInsets={{ right: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <TopBackground mode={config.appMode} />
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "position" })}
          keyboardVerticalOffset={Platform.select({ ios: -80 })}
        >
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
                      "Discard transaction?",
                      "This will clear all scanned items",
                      [
                        {
                          text: "Cancel"
                        },
                        {
                          text: "Discard",
                          onPress: () => {
                            setMerchantCode("");
                            resetState();
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
            onVoucherCodeRemove={removeVoucher}
            onExit={() => setShowAllValidVouchersModal(false)}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      {shouldShowCamera && (
        <VoucherScanner
          vouchers={vouchers}
          isScanningEnabled={isScanningEnabled}
          onBarCodeScanned={onBarCodeScanned}
          onVoucherCodeSubmit={onCheckVoucher}
          onCancel={() => setShouldShowCamera(false)}
        />
      )}
      <VoucherStatusModal
        checkValidityState={checkValidityState}
        error={validityError}
        onExit={onModalExit}
      />
    </>
  );
};

export const MerchantPayoutScreenContainer = withNavigationFocus(
  MerchantPayoutScreen
);
