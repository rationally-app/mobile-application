import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { View, StyleSheet, ActivityIndicator, BackHandler } from "react-native";
import { CustomerQuotaStackParamList } from "../../types";
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
import { CheckoutUnsuccessfulCard } from "./CheckoutUnsuccessful/CheckoutUnsuccessfulCard";
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
import {
  ErrorWithCodes,
  NetworkError,
  SessionError,
} from "../../services/helpers";
import { useQuota } from "../../hooks/useQuota/useQuota";
import { AuthStoreContext } from "../../context/authStore";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { PaymentQRUnsupportedError } from "../../utils/paymentQrValidation";
import {
  PaymentQRDeformedError,
  PaymentQRMissingInfoError,
} from "@rationally-app/payment-qr-parser";
import { useGovWalletBalance } from "../../hooks/govwallet/useGovWalletBalance/useGovWalletBalance";
import { GovWalletIncorrectBalanceCard } from "./GovWallet/IncorrectBalanceCard";
import { StackScreenProps } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  loadingWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "relative",
    padding: size(1.5),
    paddingTop: size(8),
    paddingBottom: size(10),
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
});

type Props = StackScreenProps<
  CustomerQuotaStackParamList,
  "CustomerQuotaScreen"
> & { navIds: string[] };

export const CustomerQuotaScreen: FunctionComponent<Props> = ({ navIds }) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "CustomerQuotaScreen",
    });
  }, []);

  const navigation = useNavigation();

  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const { operatorToken, sessionToken, endpoint } = useContext(AuthContext);
  const showHelpModal = useContext(HelpModalContext);
  const { showErrorAlert } = useContext(AlertModalContext);
  const [ids, setIds] = useState<string[]>(navIds);
  const { features: campaignFeatures } = useContext(CampaignConfigContext);
  const [updateAfterPurchased, setUpdateAfterPurchased] =
    useState<boolean>(false);

  const { setAuthCredentials } = useContext(AuthStoreContext);

  const {
    quotaResponse,
    allQuotaResponse,
    quotaState,
    quotaError,
    updateQuota,
    clearQuotaError,
  } = useQuota(ids, sessionToken, endpoint);

  const {
    govWalletBalanceState,
    govWalletBalanceError,
    clearGovWalletBalanceError,
    govWalletBalanceInCents,
    lastModifiedDate,
  } = useGovWalletBalance(ids, sessionToken, endpoint);

  const {
    cartState,
    cart,
    updateCart,
    checkoutCart,
    completeCheckout,
    cartError,
    clearCartError,
    resetCartState,
  } = useCart(ids, sessionToken, endpoint, quotaResponse?.remainingQuota);

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "cartState",
      message: cartState,
    });
  }, [cartState]);

  const onCancel = useCallback((): void => {
    navigation.navigate({
      name: "DrawerNavigator",
      key: "CollectCustomerDetailsScreen",
    });
  }, [navigation]);

  const onBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  const addId = useCallback((id: string): void => {
    setIds((ids) => [...ids, id]);
  }, []);

  const onAppeal = useCallback((): void => {
    navigation.navigate({ key: "CustomerAppealScreen", params: { ids } });
  }, [ids, navigation]);

  const onNextId = useCallback((): void => {
    navigation.navigate({
      name: "DrawerNavigator",
      key: "CollectCustomerDetailsScreen",
    });
  }, [navigation]);

  useEffect(() => {
    if (cartState !== "PURCHASED") return;

    const onBackPress = (): boolean => {
      navigation.navigate({
        name: "DrawerNavigator",
        key: "CollectCustomerDetailsScreen",
      });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => backHandler.remove();
  }, [cartState, navigation]);

  const expireSession = useCallback(() => {
    const key = `${operatorToken}${endpoint}`;
    setAuthCredentials(key, {
      operatorToken,
      endpoint,
      sessionToken,
      expiry: new Date().getTime(),
    });
  }, [setAuthCredentials, endpoint, operatorToken, sessionToken]);

  useEffect(() => {
    if (!cartError && !quotaError && !govWalletBalanceError) {
      return;
    }
    /**
     * We check for quota errors first because the cart relies on the quota.
     */
    if (quotaError) {
      switch (true) {
        case quotaError instanceof NetworkError:
          throw quotaError; // Let error boundary handle.
        case quotaError instanceof SessionError:
          clearQuotaError();
          expireSession();
          showErrorAlert(quotaError, () => {
            navigation.navigate("DrawerNavigator", {
              screen: "CampaignLocationsScreen",
              params: {
                shouldAutoLoad: true,
              },
            });
          });
          return;
      }
      showErrorAlert(quotaError, () => navigation.goBack());
      return;
    }

    if (quotaState === "DEFAULT" && govWalletBalanceError) {
      switch (true) {
        case govWalletBalanceError instanceof NetworkError:
          throw govWalletBalanceError; // Let error boundary handle.
        case govWalletBalanceError instanceof SessionError:
          clearGovWalletBalanceError();
          expireSession();
          showErrorAlert(govWalletBalanceError, () => {
            navigation.navigate("DrawerNavigator", {
              screen: "CampaignLocationsScreen",
              params: {
                shouldAutoLoad: true,
              },
            });
          });
          return;
      }
      showErrorAlert(govWalletBalanceError, () => navigation.goBack());
      return;
    }

    if (cartError) {
      switch (true) {
        case cartError instanceof SessionError:
          clearCartError();
          expireSession();
          showErrorAlert(cartError, () => {
            navigation.navigate("DrawerNavigator", {
              screen: "CampaignLocationsScreen",
              params: {
                shouldAutoLoad: true,
              },
            });
          });
          return;
        case cartError instanceof NetworkError:
          throw cartError; // Let error boundary handle.
        case cartError instanceof PaymentQRDeformedError ||
          cartError instanceof PaymentQRMissingInfoError ||
          cartError instanceof PaymentQRUnsupportedError:
          showErrorAlert(cartError, () => clearCartError());
          return;
        case cartError instanceof ErrorWithCodes:
          showErrorAlert(cartError, () => {
            navigation.navigate({
              key: "CollectCustomerDetailsScreen",
            });
          });
          return;
      }
      if (cartState === "DEFAULT" || cartState === "CHECKING_OUT") {
        const invalidIdentifierInputErrMsg =
          ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT ||
          ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT_TEXT_DISABLED;

        const missingIdentifierInputErrMsg =
          ERROR_MESSAGE.MISSING_IDENTIFIER_INPUT ||
          ERROR_MESSAGE.MISSING_IDENTIFIER_INPUT_TEXT_DISABLED;

        switch (cartError.message) {
          case missingIdentifierInputErrMsg:
            const missingIdentifierInputError = new Error(
              campaignFeatures?.campaignName === "TT Tokens"
                ? ERROR_MESSAGE.MISSING_POD_INPUT
                : campaignFeatures?.campaignName.includes("Vouchers")
                ? ERROR_MESSAGE.MISSING_VOUCHER_INPUT
                : missingIdentifierInputErrMsg
            );
            showErrorAlert(missingIdentifierInputError, () => clearCartError());
            break;
          case invalidIdentifierInputErrMsg:
            const invalidIdentifierInputError = new Error(
              campaignFeatures?.campaignName === "TT Tokens"
                ? ERROR_MESSAGE.INVALID_POD_INPUT
                : invalidIdentifierInputErrMsg
            );
            Sentry.captureException(invalidIdentifierInputError);
            showErrorAlert(invalidIdentifierInputError, () => clearCartError());
            break;
          case ERROR_MESSAGE.DUPLICATE_IDENTIFIER_INPUT:
            const duplicateIdentifierInputError = new Error(
              campaignFeatures?.campaignName === "TT Tokens"
                ? ERROR_MESSAGE.DUPLICATE_POD_INPUT
                : ERROR_MESSAGE.DUPLICATE_IDENTIFIER_INPUT
            );
            Sentry.captureException(duplicateIdentifierInputError);
            showErrorAlert(duplicateIdentifierInputError, () =>
              clearCartError()
            );
            break;
          case ERROR_MESSAGE.LOCK_ERROR:
            clearCartError();
            showErrorAlert(cartError, () => {
              navigation.navigate({ key: "CampaignLocationsScreen" });
            });
            break;
          case ERROR_MESSAGE.INVALID_QUANTITY:
          case ERROR_MESSAGE.MISSING_SELECTION:
          case ERROR_MESSAGE.MISSING_DISBURSEMENTS:
            showErrorAlert(cartError, () => clearCartError());
            break;
          default:
            showErrorAlert(cartError, () => {
              clearCartError();
            });
        }
      } else {
        throw new Error(cartError.message);
      }
    }
  }, [
    campaignFeatures?.campaignName,
    cartState,
    clearCartError,
    cartError,
    expireSession,
    navigation,
    showErrorAlert,
    quotaState,
    quotaError,
    clearQuotaError,
    govWalletBalanceError,
    clearGovWalletBalanceError,
  ]);

  useEffect(() => {
    /**
     * Update quota after checkout
     */
    if (cartState === "PURCHASED" && !updateAfterPurchased) {
      updateQuota();
      setUpdateAfterPurchased(true);
    }
  }, [cartState, updateQuota, updateAfterPurchased]);

  const { i18nt } = useTranslate();

  return quotaState === "FETCHING_QUOTA" ||
    govWalletBalanceState === "FETCHING_BALANCE" ? (
    <View style={styles.loadingWrapper}>
      <TopBackground style={{ height: "100%", maxHeight: "auto" }} />
      <Card>
        <ActivityIndicator size="large" color={color("grey", 40)} />
        <AppText style={{ marginTop: size(1) }}>
          {i18nt("customerQuotaScreen", "quotaCheck")}
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
        ) : cartState === "UNSUCCESSFUL" ? (
          <CheckoutUnsuccessfulCard ids={ids} onCancel={onCancel} />
        ) : quotaState === "NO_QUOTA" ? (
          <NoQuotaCard
            ids={ids}
            cart={cart}
            onCancel={onCancel}
            onAppeal={onAppeal}
            quotaResponse={quotaResponse}
            allQuotaResponse={allQuotaResponse}
          />
        ) : quotaState === "NOT_ELIGIBLE" ? (
          <NotEligibleCard ids={ids} onCancel={onCancel} />
        ) : govWalletBalanceState === "INELIGIBLE" ? (
          <GovWalletIncorrectBalanceCard
            ids={ids}
            onCancel={onCancel}
            govWalletBalanceInCents={govWalletBalanceInCents}
            lastModifiedDate={lastModifiedDate}
          />
        ) : (
          <ItemsSelectionCard
            ids={ids}
            addId={addId}
            isLoading={cartState === "CHECKING_OUT"}
            hasPendingConfirmation={cartState === "PENDING_CONFIRMATION"}
            checkoutCart={checkoutCart}
            completeCheckout={completeCheckout}
            resetCartState={resetCartState}
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
