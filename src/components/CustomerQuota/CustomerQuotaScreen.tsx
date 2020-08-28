import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useContext
} from "react";
import { View, StyleSheet, ActivityIndicator, BackHandler } from "react-native";
import { NavigationProps } from "../../types";
import { color, size } from "../../common/styles";
import { useAuthenticationContext } from "../../context/auth";
import { AppHeader } from "../Layout/AppHeader";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { useConfigContext } from "../../context/config";
import { Card } from "../Layout/Card";
import { ItemsSelectionCard } from "./ItemsSelection/ItemsSelectionCard";
import { NoQuotaCard } from "./NoQuotaCard";
import { CheckoutSuccessCard } from "./CheckoutSuccess/CheckoutSuccessCard";
import { useCart } from "../../hooks/useCart/useCart";
import { Sentry } from "../../utils/errorTracking";
import { HelpModalContext } from "../../context/help";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { useValidateExpiry } from "../../hooks/useValidateExpiry";
import { Banner } from "../Layout/Banner";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { NotEligibleCard } from "./NotEligibleCard";
import { KeyboardAvoidingScrollView } from "../Layout/KeyboardAvoidingScrollView";
import { CampaignConfigContext } from "../../context/campaignConfig";
import {
  AlertModalContext,
  wrongFormatAlertProps,
  incompleteEntryAlertProps,
  systemAlertProps,
  ERROR_MESSAGE,
  expiredAlertProps
} from "../../context/alert";
import { navigateHome, replaceRoute } from "../../common/navigation";
import { useLogout } from "../../hooks/useLogout";
import { AuthenticationError } from "../../services/quota";

type CustomerQuotaProps = NavigationProps & { navIds: string[] };

const styles = StyleSheet.create({
  loadingWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    position: "relative",
    padding: size(1.5),
    paddingTop: size(8),
    paddingBottom: size(10),
    height: "100%",
    width: 512,
    maxWidth: "100%"
  },
  headerText: {
    marginBottom: size(4)
  },
  bannerWrapper: {
    marginBottom: size(1.5)
  }
});

export const CustomerQuotaScreen: FunctionComponent<CustomerQuotaProps> = ({
  navigation,
  navIds
}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "CustomerQuotaScreen"
    });
  }, []);

  const validateTokenExpiry = useValidateExpiry(navigation.dispatch);
  useEffect(() => {
    validateTokenExpiry();
  }, [validateTokenExpiry]);

  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const { token, endpoint } = useAuthenticationContext();
  const showHelpModal = useContext(HelpModalContext);
  const { showAlert } = useContext(AlertModalContext);
  const [ids, setIds] = useState<string[]>(navIds);
  const { features: campaignFeatures } = useContext(CampaignConfigContext);
  const { logout } = useLogout();

  const forceLogout = useCallback((): void => {
    logout(navigation.dispatch, {
      ...expiredAlertProps,
      description: ERROR_MESSAGE.AUTH_FAILURE_INVALID_TOKEN
    });
  }, [logout, navigation.dispatch]);

  const {
    cartState,
    cart,
    updateCart,
    checkoutCart,
    checkoutResult,
    error,
    clearError
  } = useCart(ids, token, endpoint);

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "cartState",
      message: cartState
    });
  }, [cartState]);

  const onCancel = useCallback((): void => {
    navigateHome(navigation);
  }, [navigation]);

  const onBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  const addId = useCallback((id: string): void => {
    setIds(ids => [...ids, id]);
  }, []);

  const onAppeal = useCallback((): void => {
    replaceRoute(navigation, "CustomerAppealScreen", { ids });
  }, [ids, navigation]);

  const onNextId = useCallback((): void => {
    navigateHome(navigation);
  }, [navigation]);

  useEffect(() => {
    if (cartState !== "PURCHASED") return;

    const onBackPress = (): boolean => {
      navigateHome(navigation);
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [cartState, navigation]);

  useEffect(() => {
    if (!error) {
      return;
    }
    if (error instanceof AuthenticationError) {
      clearError();
      forceLogout();
      return;
    }
    if (cartState === "FETCHING_QUOTA") {
      const message = error.message ?? ERROR_MESSAGE.QUOTA_ERROR;
      showAlert({
        ...systemAlertProps,
        description: message,
        onOk: () => clearError()
      });
    } else if (cartState === "DEFAULT" || cartState === "CHECKING_OUT") {
      switch (error.message) {
        case ERROR_MESSAGE.MISSING_SELECTION:
          showAlert({
            ...incompleteEntryAlertProps,
            description: ERROR_MESSAGE.MISSING_SELECTION,
            onOk: () => clearError()
          });
          break;

        case ERROR_MESSAGE.MISSING_IDENTIFIER_INPUT:
          showAlert({
            ...incompleteEntryAlertProps,
            description:
              campaignFeatures?.campaignName === "TT Tokens"
                ? ERROR_MESSAGE.MISSING_POD_INPUT
                : campaignFeatures?.campaignName.includes("Vouchers")
                ? ERROR_MESSAGE.MISSING_VOUCHER_INPUT
                : ERROR_MESSAGE.MISSING_IDENTIFIER_INPUT,
            onOk: () => clearError()
          });
          break;

        case ERROR_MESSAGE.SERVER_ERROR:
          showAlert({
            ...systemAlertProps,
            description: error.message,
            onOk: () => clearError()
          });
          break;

        case ERROR_MESSAGE.DUPLICATE_IDENTIFIER_INPUT:
          showAlert({
            ...systemAlertProps,
            title: "Already used",
            description:
              campaignFeatures?.campaignName === "TT Tokens"
                ? ERROR_MESSAGE.DUPLICATE_POD_INPUT
                : ERROR_MESSAGE.DUPLICATE_IDENTIFIER_INPUT,
            onOk: () => clearError()
          });
          break;

        case ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT:
          showAlert({
            ...wrongFormatAlertProps,
            description:
              campaignFeatures?.campaignName === "TT Tokens"
                ? ERROR_MESSAGE.INVALID_POD_INPUT
                : ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT,
            onOk: () => clearError()
          });
          break;

        case ERROR_MESSAGE.INVALID_PHONE_NUMBER:
        case ERROR_MESSAGE.INVALID_PHONE_AND_COUNTRY_CODE:
          showAlert({
            ...wrongFormatAlertProps,
            description: error.message,
            onOk: () => clearError()
          });
          break;

        default:
          throw new Error(error.message);
      }
    }
  }, [
    cartState,
    clearError,
    error,
    onCancel,
    showAlert,
    campaignFeatures,
    forceLogout
  ]);

  return cartState === "FETCHING_QUOTA" ? (
    <View style={styles.loadingWrapper}>
      <TopBackground style={{ height: "100%", maxHeight: "auto" }} />
      <Card>
        <ActivityIndicator size="large" color={color("grey", 40)} />
        <AppText style={{ marginTop: size(1) }}>Checking...</AppText>
      </Card>
    </View>
  ) : (
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

        {cartState === "PURCHASED" ? (
          <CheckoutSuccessCard
            ids={ids}
            onCancel={onNextId}
            checkoutResult={checkoutResult}
          />
        ) : cartState === "NO_QUOTA" ? (
          <NoQuotaCard
            ids={ids}
            cart={cart}
            onCancel={onCancel}
            onAppeal={onAppeal}
          />
        ) : cartState === "NOT_ELIGIBLE" ? (
          <NotEligibleCard ids={ids} onCancel={onCancel} />
        ) : (
          <ItemsSelectionCard
            ids={ids}
            addId={addId}
            isLoading={cartState === "CHECKING_OUT"}
            checkoutCart={checkoutCart}
            onCancel={onCancel}
            onBack={onBack}
            cart={cart}
            updateCart={updateCart}
          />
        )}
        <FeatureToggler feature="HELP_MODAL">
          <HelpButton onPress={showHelpModal} />
        </FeatureToggler>
      </View>
    </KeyboardAvoidingScrollView>
  );
};
