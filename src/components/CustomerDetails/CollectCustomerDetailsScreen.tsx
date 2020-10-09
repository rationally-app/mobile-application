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
import { size, fontSize, borderRadius, color } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { Credits } from "../Credits";
import { useConfigContext } from "../../context/config";
import {
  withNavigationFocus,
  NavigationFocusInjectedProps
} from "react-navigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import { CampaignConfigContext } from "../../context/campaignConfig";
import { AlertModalContext } from "../../context/alert";
import { TouchableOpacity } from "react-native-gesture-handler";
import { i18nt } from "../../utils/translations";

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
    marginBottom: size(3),
    flexGrow: 1,
    flexShrink: 1
  },
  manageButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius(2),
    padding: size(1),
    marginRight: -size(1),
    marginTop: -size(0.5),
    marginBottom: size(3)
  },
  statsButton: {
    marginTop: size(4),
    flexDirection: "row",
    alignSelf: "center"
  },
  statsText: {
    marginTop: size(4),
    fontSize: fontSize(0)
  },
  statsIcon: {
    marginTop: size(4),
    alignSelf: "center",
    marginRight: size(0.5)
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
  const { showErrorAlert } = useContext(AlertModalContext);
  const { features, policies } = useContext(CampaignConfigContext);

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
      if (!features) {
        return;
      }
      const id = validateAndCleanId(
        input,
        features.id.validation,
        features.id.validationRegex
      );
      Vibration.vibrate(50);
      const defaultProducts = policies?.filter(
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
      showErrorAlert(e, () => setIsScanningEnabled(true));
    }
  };

  const onBarCodeScanned: BarCodeScannedCallback = event => {
    if (isFocused && isScanningEnabled && event.data) {
      onCheck(event.data);
    }
  };

  const onPressStatistics = (): void => {
    navigation.navigate("DailyStatisticsScreen");
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
            {features?.campaignName && (
              <AppText style={styles.campaignName}>
                {features.campaignName}
              </AppText>
            )}
            <AppText>
              {i18nt("collectCustomerDetailsScreen", "checkEligibleItems")}
            </AppText>
            <InputIdSection
              openCamera={() => setShouldShowCamera(true)}
              idInput={idInput}
              setIdInput={setIdInput}
              submitId={() => onCheck(idInput)}
              keyboardType={
                features?.id.type === "NUMBER" ? "numeric" : "default"
              }
            />
            <TouchableOpacity
              onPress={onPressStatistics}
              style={styles.statsButton}
            >
              <MaterialCommunityIcons
                style={styles.statsIcon}
                name="poll"
                size={size(2)}
                color={color("blue", 50)}
              />
              <AppText style={styles.statsText}>Go to statistics</AppText>
            </TouchableOpacity>
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
          barCodeTypes={
            features?.id.scannerType === "QR"
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
