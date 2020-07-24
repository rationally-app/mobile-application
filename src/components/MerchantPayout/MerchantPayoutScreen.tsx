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
  Alert,
  Vibration,
  BackHandler,
  Keyboard
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
import { VoucherStatusModal } from "./VoucherStatusModal/VoucherStatusModal";
import { AllValidVouchersModal } from "./AllValidVouchersModal";
import { useVoucher } from "../../hooks/useVoucher/useVoucher";
import { useCheckVoucherValidity } from "../../hooks/useCheckVoucherValidity/useCheckVoucherValidity";
import { useAuthenticationContext } from "../../context/auth";
import { KeyboardAvoidingScrollView } from "../Layout/KeyboardAvoidingScrollView";

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
    checkoutVouchersState,
    vouchers,
    addVoucher,
    removeVoucher,
    checkoutVouchers,
    checkoutResult,
    error: merchantError,
    resetState: resetVoucherState
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

  const onCheckVoucher = (input: string): void => {
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

  const redeemVouchers = (): void => {
    checkoutVouchers(merchantCode);
  };

  const resetState = useCallback((): void => {
    setMerchantCode("");
    setShouldShowCamera(false);
    resetVoucherState();
  }, [resetVoucherState]);

  // Detect submission of merchant code
  useEffect(() => {
    if (checkoutVouchersState === "RESULT_RETURNED" && checkoutResult) {
      navigation.navigate("PayoutFeedbackScreen", {
        merchantCode,
        checkoutResult
      });
      resetState();
      Vibration.vibrate(50);
    } else if (merchantError) {
      Alert.alert("Error", merchantError.message, [
        {
          text: "Dismiss",
          onPress: () => resetVoucherState(true)
        }
      ]);
    }
  }, [
    checkoutVouchersState,
    merchantError,
    checkoutResult,
    navigation,
    merchantCode,
    resetState,
    resetVoucherState
  ]);

  const closeCamera = useCallback(() => setShouldShowCamera(false), []);
  const openCamera = useCallback(() => {
    Keyboard.dismiss();
    setShouldShowCamera(true);
  }, []);

  return (
    <>
      <KeyboardAvoidingScrollView>
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
              openCamera={openCamera}
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
                  isLoading={checkoutVouchersState !== "DEFAULT"}
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
      </KeyboardAvoidingScrollView>

      {shouldShowCamera && (
        <VoucherScanner
          vouchers={vouchers}
          isScanningEnabled={isScanningEnabled}
          onCheckVoucher={onCheckVoucher}
          onCancel={closeCamera}
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
