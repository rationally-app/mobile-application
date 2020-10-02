import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useCallback
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
import { AlertModalContext, wrongFormatAlertProps } from "../../context/alert";
import { InputSelection } from "./InputSelection";
import { ManualPassportInput } from "./ManualPassportInput";
import { IdentificationFlag } from "../../types";
import {
  IdentificationContext,
  defaultSelectedIdType
} from "../../context/identification";
import { MrzCamera } from "./MrzCamera";
import { TouchableOpacity } from "react-native-gesture-handler";

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
  const [shouldShowMrzCamera, setShouldShowMrzCamera] = useState(false);
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const [idInput, setIdInput] = useState("");
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);
  const checkUpdates = useCheckUpdates();
  const { showAlert } = useContext(AlertModalContext);
  const { features, policies } = useContext(CampaignConfigContext);
  const { selectedIdType, setSelectedIdType } = useContext(
    IdentificationContext
  );
  const [mrzResult, setMrzResult] = useState("MRZ image");

  const getSelectionArray = useCallback((): IdentificationFlag[] => {
    const selectionArray = [];
    selectionArray.push(features?.id || defaultSelectedIdType);
    features?.alternateIds &&
      features.alternateIds.map(alternateId =>
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

        if (shouldShowMrzCamera) {
          setShouldShowMrzCamera(false);
          return true;
        }
        return false;
      }
    );
    return () => {
      backHandler.remove();
    };
  }, [shouldShowCamera, shouldShowMrzCamera]);

  useEffect(() => {
    if (shouldShowCamera || shouldShowMrzCamera) {
      Keyboard.dismiss();
    }
  }, [shouldShowCamera, shouldShowMrzCamera]);

  useEffect(() => {
    const selectionDetails = getSelectionArray();
    // in the event the saved selection not found.. will always fall back to the first idType in array
    setSelectedIdType(
      selectionDetails.some(
        selection => selection.label === selectedIdType.label
      )
        ? selectedIdType
        : selectionDetails[0]
    );
  }, [getSelectionArray, selectedIdType, setSelectedIdType]);

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
      showAlert({
        ...wrongFormatAlertProps,
        description: e.message,
        onOk: () => setIsScanningEnabled(true)
      });
    }
  };

  const onBarCodeScanned: BarCodeScannedCallback = event => {
    if (isFocused && isScanningEnabled && event.data) {
      onCheck(event.data);
    }
  };

  const onInputSelection = (inputType: IdentificationFlag): void => {
    setSelectedIdType(inputType);
  };

  const hasMultiInputSelection = (): boolean => {
    return getSelectionArray().length > 1;
  };

  const getInputComponent = (): JSX.Element => {
    return selectedIdType.label === "Passport" &&
      selectedIdType.scannerType === "NONE" ? (
      <ManualPassportInput
        openCamera={() => setShouldShowMrzCamera(true)}
        closeCamera={() => setShouldShowMrzCamera(false)}
        mrzResult={mrzResult}
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
              selectionArray={getSelectionArray()}
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
            {features?.campaignName && (
              <AppText style={styles.campaignName}>
                {features.campaignName}
              </AppText>
            )}
            <AppText>
              Check the number of item(s) eligible for redemption
            </AppText>
            {getInputComponent()}
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
          cancelButtonText="Enter ID manually"
          barCodeTypes={
            features?.id.scannerType === "QR"
              ? [BarCodeScanner.Constants.BarCodeType.qr]
              : [BarCodeScanner.Constants.BarCodeType.code39]
          }
        />
      )}
      {shouldShowMrzCamera && (
        <MrzCamera
          onResult={(result: string) => setMrzResult(result)}
          closeCamera={() => setShouldShowMrzCamera(false)}
        />
      )}
    </>
  );
};

export const CollectCustomerDetailsScreenContainer = withNavigationFocus(
  CollectCustomerDetailsScreen
);
