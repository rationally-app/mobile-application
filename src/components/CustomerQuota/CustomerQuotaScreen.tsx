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
import { AuthContext } from "../../context/auth";
import { AppHeader } from "../Layout/AppHeader";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { useConfigContext } from "../../context/config";
import { Card } from "../Layout/Card";
import { ItemsSelectionCard } from "./ItemsSelection/ItemsSelectionCard";
import { NoQuotaCard } from "./NoQuota/NoQuotaCard";
import { CheckoutSuccessCard } from "./CheckoutSuccess/CheckoutSuccessCard";
import { useCart } from "../../hooks/useCart/useCart";
import { Sentry } from "../../utils/errorTracking";
import { HelpModalContext } from "../../context/help";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { Banner } from "../Layout/Banner";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { NotEligibleCard } from "./NotEligibleCard";
import { KeyboardAvoidingScrollView } from "../Layout/KeyboardAvoidingScrollView";
import { CampaignConfigContext } from "../../context/campaignConfig";
import { AlertModalContext, ERROR_MESSAGE } from "../../context/alert";
import { navigateHome, replaceRoute } from "../../common/navigation";
import { SessionError } from "../../services/helpers";
import { AuthStoreContext } from "../../context/authStore";
import i18n from "i18n-js";

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

  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const { operatorToken, sessionToken, endpoint } = useContext(AuthContext);
  const showHelpModal = useContext(HelpModalContext);
  const { showErrorAlert } = useContext(AlertModalContext);
  const [ids, setIds] = useState<string[]>(navIds);
  const { features: campaignFeatures } = useContext(CampaignConfigContext);

  const { setAuthCredentials } = useContext(AuthStoreContext);

  const {
    cartState,
    cart,
    updateCart,
    checkoutCart,
    error,
    clearError,
    quotaResponse
  } = useCart(ids, sessionToken, endpoint);

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

  const expireSession = useCallback(() => {
    const key = `${operatorToken}${endpoint}`;
    setAuthCredentials(key, {
      operatorToken,
      endpoint,
      sessionToken,
      expiry: new Date().getTime()
    });
  }, [setAuthCredentials, endpoint, operatorToken, sessionToken]);

  useEffect(() => {
    if (!error) {
      return;
    }
    if (error instanceof SessionError) {
      clearError();
      expireSession();
      showErrorAlert(error, () => {
        navigation.navigate("CampaignLocationsScreen");
      });
      return;
    }
    if (cartState === "DEFAULT" || cartState === "CHECKING_OUT") {
      switch (error.message) {
        case ERROR_MESSAGE.MISSING_IDENTIFIER_INPUT:
          const missingIdentifierInputError = new Error(
            campaignFeatures?.campaignName === "TT Tokens"
              ? ERROR_MESSAGE.MISSING_POD_INPUT
              : campaignFeatures?.campaignName.includes("Vouchers")
              ? ERROR_MESSAGE.MISSING_VOUCHER_INPUT
              : ERROR_MESSAGE.MISSING_IDENTIFIER_INPUT
          );
          showErrorAlert(missingIdentifierInputError, () => clearError());
          break;
        case ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT:
          const invalidIdentifierInputError = new Error(
            campaignFeatures?.campaignName === "TT Tokens"
              ? ERROR_MESSAGE.INVALID_POD_INPUT
              : ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT
          );
          showErrorAlert(invalidIdentifierInputError, () => clearError());
          break;
        case ERROR_MESSAGE.DUPLICATE_IDENTIFIER_INPUT:
          const duplicateIdentifierInputError = new Error(
            campaignFeatures?.campaignName === "TT Tokens"
              ? ERROR_MESSAGE.DUPLICATE_POD_INPUT
              : ERROR_MESSAGE.DUPLICATE_IDENTIFIER_INPUT
          );
          showErrorAlert(duplicateIdentifierInputError, () => clearError());
          break;
        default:
          showErrorAlert(error, () => clearError());
      }
    } else {
      throw new Error(error.message);
    }
  }, [
    campaignFeatures?.campaignName,
    cartState,
    clearError,
    error,
    expireSession,
    navigation,
    showErrorAlert
  ]);

  return cartState === "FETCHING_QUOTA" ? (
    <View style={styles.loadingWrapper}>
      <TopBackground style={{ height: "100%", maxHeight: "auto" }} />
      <Card>
        <ActivityIndicator size="large" color={color("grey", 40)} />
        <AppText style={{ marginTop: size(1) }}>
          {i18n.t("customerQuotaScreen.quotaCheck")}...
        </AppText>
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
            quotaResponse={quotaResponse}
          />
        ) : cartState === "NO_QUOTA" ? (
          <NoQuotaCard
            ids={ids}
            cart={cart}
            onCancel={onCancel}
            onAppeal={onAppeal}
            quotaResponse={quotaResponse}
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
