import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { transform } from "lodash";
import { StyleSheet, View } from "react-native";
import { NavigationProps } from "../../types";
import { size } from "../../common/styles";
import { AppHeader } from "../Layout/AppHeader";
import { TopBackground } from "../Layout/TopBackground";
import { useConfigContext } from "../../context/config";
import { HelpModalContext } from "../../context/help";
import { useProductContext } from "../../context/products";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { useValidateExpiry } from "../../hooks/useValidateExpiry";
import { Banner } from "../Layout/Banner";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { KeyboardAvoidingScrollView } from "../Layout/KeyboardAvoidingScrollView";
import {
  ReasonSelectionCard,
  Reason
} from "./ReasonSelection/ReasonSelectionCard";
import { pushRoute, navigateHome } from "../../common/navigation";
import { useAuthenticationContext } from "../../context/auth";
import { useCart } from "../../hooks/useCart/useCart";
import { Sentry } from "../../utils/errorTracking";

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

export const CustomerAppealScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "CustomerAppealScreen"
    });
  }, []);

  const [ids] = useState(navigation.getParam("ids"));
  const { allProducts } = useProductContext();

  const validateTokenExpiry = useValidateExpiry(navigation.dispatch);
  useEffect(() => {
    validateTokenExpiry();
  }, [validateTokenExpiry]);

  const onCancel = useCallback((): void => {
    navigateHome(navigation);
  }, [navigation]);

  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);

  const { token, endpoint } = useAuthenticationContext();
  const { allQuotaResponse, emptyCart } = useCart(ids, token, endpoint);

  const getReasons = (): Reason[] => {
    return transform(
      allProducts,
      (result: Reason[], policy) => {
        if (policy.categoryType === "APPEAL") {
          const policyLimt = policy.quantity.limit;
          const quotaResponse = allQuotaResponse?.remainingQuota.find(
            quota => quota.category === policy.category
          );
          let descriptionAlert: string | undefined = undefined;
          if (
            quotaResponse &&
            policy.alert &&
            policyLimt - quotaResponse.quantity >= policy.alert.threshold
          ) {
            descriptionAlert = policy.alert.label;
          }
          result.push({
            description: policy.name,
            descriptionAlert: descriptionAlert
          });
        }
      },
      []
    );
  };

  const onReasonSelection = (productName: string): void => {
    emptyCart();
    const appealProducts = allProducts.find(
      policy => policy.categoryType === "APPEAL" && policy.name === productName
    );
    if (appealProducts === undefined) {
      Sentry.captureException(`Unable to find appeal product: ${productName}}`);
      return;
    }
    pushRoute(navigation, "CustomerQuotaProxy", {
      id: ids,
      products: [appealProducts]
    });
  };

  return (
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
        <ReasonSelectionCard
          ids={ids}
          reasonSelectionHeader={"Indicate reason for appeal"}
          reasons={getReasons()}
          onCancel={onCancel}
          onReasonSelection={onReasonSelection}
        />
        <FeatureToggler feature="HELP_MODAL">
          <HelpButton onPress={showHelpModal} />
        </FeatureToggler>
      </View>
    </KeyboardAvoidingScrollView>
  );
};
