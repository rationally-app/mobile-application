import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  Vibration,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { size, fontSize } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { Credits } from "../Credits";
import { useConfigContext } from "../../context/config";
import {
  withNavigationFocus,
  NavigationFocusInjectedProps,
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
import { InputSelection } from "./InputSelection";
import { InputPassportSection } from "./InputPassportSection";
import { IdentificationFlag } from "../../types";
import {
  IdentificationContext,
  defaultSelectedIdType,
} from "../../context/identification";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { extractPassportIdFromEvent } from "../../utils/passportScanning";
import { useTheme } from "../../context/theme";
import { GOVWALLET_THEME_NAME } from "../../common/styles/themes";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(2),
    paddingVertical: size(8),
    height: "100%",
    width: 512,
    maxWidth: "100%",
  },
  headerText: {
    marginBottom: size(4),
  },
  bannerWrapper: {
    marginBottom: size(1.5),
  },
  campaignName: {
    fontFamily: "brand-bold",
    fontSize: fontSize(3),
    marginBottom: size(3),
    flexGrow: 1,
    flexShrink: 1,
  },
  statsButton: {
    paddingHorizontal: size(4),
    paddingVertical: size(3),
    marginTop: size(3),
    marginBottom: size(3),
    flexDirection: "row",
    alignSelf: "center",
  },
  statsText: {
    fontSize: fontSize(0),
  },
  statsIcon: {
    alignSelf: "center",
    marginRight: size(0.5),
  },
});

const CollectCustomerDetailsScreen: FunctionComponent<NavigationFocusInjectedProps> = ({
  navigation,
  isFocused,
}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "CollectCustomerDetailsScreen",
    });
  }, []);

  const { theme } = useTheme();
  const messageContent = useContext(ImportantMessageContentContext);
  const [shouldShowCamera, setShouldShowCamera] = useState(false);
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const [idInput, setIdInput] = useState("");
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);
  const checkUpdates = useCheckUpdates();
  const { showErrorAlert } = useContext(AlertModalContext);
  const { features, policies } = useContext(CampaignConfigContext);
  const { i18nt, c13nt } = useTranslate();
  const { selectedIdType, setSelectedIdType } = useContext(
    IdentificationContext
  );

  const selectionArray = useMemo((): IdentificationFlag[] => {
    const selectionArray = [];
    selectionArray.push(features?.id || defaultSelectedIdType);
    features?.alternateIds &&
      features.alternateIds.map((alternateId) =>
        selectionArray.push(alternateId)
      );
    return selectionArray;
  }, [features]);

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

  useEffect(() => {
    // in the event the saved selection not found.. will always fall back to the first idType in array
    setSelectedIdType(
      selectionArray.some((selection) => {
        return (
          selection.label &&
          selectedIdType.label &&
          selection.label === selectedIdType.label
        );
      })
        ? selectedIdType
        : selectionArray[0]
    );
  }, [selectionArray, selectedIdType, setSelectedIdType]);

  const onCheck = async (input: string): Promise<void> => {
    try {
      setIsScanningEnabled(false);
      if (!features) {
        return;
      }
      const id = validateAndCleanId(
        input,
        selectedIdType.validation,
        selectedIdType.validationRegex
      );
      Vibration.vibrate(50);
      const defaultProducts = policies?.filter(
        (policy) =>
          policy.categoryType === undefined || policy.categoryType === "DEFAULT"
      );

      setShouldShowCamera(false);
      navigation.navigate("CustomerQuotaProxy", {
        id,
        products: defaultProducts,
      });
      setIdInput("");
    } catch (e) {
      setIsScanningEnabled(false);
      showErrorAlert(e, () => setIsScanningEnabled(true));
    }
  };

  const setState = useState()[1];
  const onBarCodeScanned: BarCodeScannedCallback = (event) => {
    if (isFocused && isScanningEnabled && event.data) {
      /**
       * If "Passport" tab is chosen, we want to extract the passport
       * number from a JSON object containing the `passportId`.
       */
      if (selectedIdType.label === "Passport") {
        try {
          event.data = extractPassportIdFromEvent(event);
        } catch (e) {
          setState(() => {
            throw e;
          });
        }
      }
      onCheck(event.data);
    }
  };

  const onInputSelection = (inputType: IdentificationFlag): void => {
    if (inputType.label !== selectedIdType.label) setIdInput("");
    setSelectedIdType(inputType);
  };

  const hasMultiInputSelection = (): boolean => {
    return selectionArray.length > 1;
  };

  const getInputComponent = (): JSX.Element => {
    return selectedIdType.label === "Passport" ? (
      <InputPassportSection
        scannerType={selectedIdType.scannerType}
        openCamera={() => setShouldShowCamera(true)}
        idInput={idInput}
        setIdInput={setIdInput}
        submitId={() => onCheck(idInput)}
      />
    ) : (
      <InputIdSection
        openCamera={() => setShouldShowCamera(true)}
        idInput={idInput}
        setIdInput={setIdInput}
        submitId={() => onCheck(idInput)}
        keyboardType={features?.id.type === "NUMBER" ? "numeric" : "default"}
      />
    );
  };

  const onPressStatistics = (): void => {
    navigation.navigate("DailyStatisticsScreen");
  };

  const getBarcodeType = (): any[] => {
    if (selectedIdType.scannerType === "QR") {
      return [BarCodeScanner.Constants.BarCodeType.qr];
    } else if (selectedIdType.scannerType === "CODE_39") {
      return [BarCodeScanner.Constants.BarCodeType.code39];
    } else {
      return features?.id.scannerType === "QR"
        ? [BarCodeScanner.Constants.BarCodeType.qr]
        : [BarCodeScanner.Constants.BarCodeType.code39];
    }
  };

  const tCampaignName = c13nt(features?.campaignName ?? "");

  return (
    <>
      <Credits style={{ bottom: size(3) }} />
      <KeyboardAvoidingScrollView>
        <TopBackground mode={config.appMode} />
        <View style={styles.content}>
          <View style={styles.headerText}>
            <AppHeader mode={config.appMode} />
          </View>
          {hasMultiInputSelection() && (
            <InputSelection
              selectionArray={selectionArray}
              currentSelection={selectedIdType}
              onInputSelection={onInputSelection}
            />
          )}
          {messageContent && (
            <View style={styles.bannerWrapper}>
              <Banner {...messageContent} />
            </View>
          )}
          <Card>
            {!!tCampaignName && (
              <AppText
                style={styles.campaignName}
                accessibilityLabel="identity-details-campaign-name"
                testID="identity-details-campaign-name"
                accessible={true}
              >
                {tCampaignName}
              </AppText>
            )}
            <AppText>
              {theme.name === GOVWALLET_THEME_NAME
                ? i18nt(
                    "collectCustomerDetailsScreen",
                    "recordEligibleMerchantQr"
                  )
                : i18nt("collectCustomerDetailsScreen", "checkEligibleItems")}
            </AppText>
            {getInputComponent()}
          </Card>
          <TouchableOpacity
            onPress={onPressStatistics}
            style={styles.statsButton}
          >
            <MaterialCommunityIcons
              style={styles.statsIcon}
              name="poll"
              size={size(2)}
              color={theme.collectCustomerDetails.statsIconColor}
            />
            <AppText
              style={styles.statsText}
              accessibilityLabel="go-to-statistics"
              testID="go-to-statistics"
              accessible={true}
            >
              {i18nt("collectCustomerDetailsScreen", "goToStatistics")}
            </AppText>
          </TouchableOpacity>
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
          barCodeTypes={getBarcodeType()}
        />
      )}
    </>
  );
};

export const CollectCustomerDetailsScreenContainer = withNavigationFocus(
  CollectCustomerDetailsScreen
);
