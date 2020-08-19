import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext
} from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  Vibration,
  BackHandler
} from "react-native";
import { size, fontSize } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { Credits } from "../Credits";
import { useConfigContext } from "../../context/config";
import {
  withNavigationFocus,
  NavigationFocusInjectedProps
} from "react-navigation";
import { IdScanner } from "../IdScanner/IdScanner";
import { BarCodeScanner, BarCodeScannedCallback } from "expo-barcode-scanner";
import { validateAndCleanId } from "../../utils/validateIdentification";
import { InputIdSection } from "./InputIdSection";
import { AppHeader } from "../Layout/AppHeader";
import { Sentry } from "../../utils/errorTracking";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { HelpModalContext } from "../../context/help";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { Banner } from "../Layout/Banner";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { useCheckUpdates } from "../../hooks/useCheckUpdates";
import { KeyboardAvoidingScrollView } from "../Layout/KeyboardAvoidingScrollView";
import { useProductContext } from "../../context/products";
import { EnvVersionError } from "../../services/envVersion";
import { CampaignConfigContext } from "../../context/campaignConfig";
import {
  AlertModalContext,
  wrongFormatAlertProps,
  systemAlertProps
} from "../../context/alert";

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
  campaignName: {
    fontFamily: "brand-bold",
    fontSize: fontSize(3),
    marginBottom: size(3)
  }
});

const CollectCustomerDetailsScreen: FunctionComponent<NavigationFocusInjectedProps> = ({
  navigation,
  isFocused
}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "CollectCustomerDetailsScreen"
    });
  }, []);

  const messageContent = useContext(ImportantMessageContentContext);
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const [idInput, setIdInput] = useState("");
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);
  const checkUpdates = useCheckUpdates();
  const { features, allProducts } = useProductContext();
  const { features: campaignFeatures } = useContext(CampaignConfigContext);
  const { showAlert } = useContext(AlertModalContext);

  useEffect(() => {
    if (isFocused) {
      setIsScanningEnabled(true);
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      checkUpdates();
    }
  }, [isFocused, checkUpdates]);

  // Close camera when back action is triggered
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
    if (shouldShowCamera) {
      Keyboard.dismiss();
    }
  }, [shouldShowCamera]);

  const onCheck = async (input: string): Promise<void> => {
    try {
      setIsScanningEnabled(false);
      const id = validateAndCleanId(
        input,
        features?.id?.validation,
        features?.id?.validationRegex
      );
      Vibration.vibrate(50);
      const defaultProducts = allProducts.filter(
        policy =>
          policy.categoryType === undefined || policy.categoryType === "DEFAULT"
      );

      navigation.navigate("CustomerQuotaProxy", {
        id,
        products: defaultProducts
      });
      setIdInput("");
    } catch (e) {
      setIsScanningEnabled(false);
      if (e instanceof EnvVersionError) {
        Sentry.captureException(e);
        showAlert({
          ...systemAlertProps,
          description: e.message,
          onOk: () => setIsScanningEnabled(true)
        });
      } else {
        showAlert({
          ...wrongFormatAlertProps,
          description: e.message,
          onOk: () => setIsScanningEnabled(true)
        });
      }
    }
  };

  const onBarCodeScanned: BarCodeScannedCallback = event => {
    if (isFocused && isScanningEnabled && event.data) {
      onCheck(event.data);
    }
  };

  return (
    <>
      <Credits style={{ bottom: size(3) }} />
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
            {campaignFeatures?.campaignName && (
              <AppText style={styles.campaignName}>
                {campaignFeatures.campaignName}
              </AppText>
            )}
            <AppText>
              Check the number of item(s) eligible for redemption
            </AppText>
            <InputIdSection
              openCamera={() => setShouldShowCamera(true)}
              idInput={idInput}
              setIdInput={setIdInput}
              submitId={() => onCheck(idInput)}
              keyboardType={
                features?.id?.type === "NUMBER" ? "numeric" : "default"
              }
            />
          </Card>
          <FeatureToggler feature="HELP_MODAL">
            <HelpButton onPress={showHelpModal} />
          </FeatureToggler>
        </View>
      </KeyboardAvoidingScrollView>
      {shouldShowCamera && (
        <IdScanner
          isScanningEnabled={isScanningEnabled}
          onBarCodeScanned={onBarCodeScanned}
          onCancel={() => setShouldShowCamera(false)}
          cancelButtonText="Enter ID manually"
          barCodeTypes={
            features?.id?.scannerType === "QR"
              ? [BarCodeScanner.Constants.BarCodeType.qr]
              : [BarCodeScanner.Constants.BarCodeType.code39]
          }
        />
      )}
    </>
  );
};

export const CollectCustomerDetailsScreenContainer = withNavigationFocus(
  CollectCustomerDetailsScreen
);
