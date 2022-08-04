import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { transform } from "lodash";
import { StyleSheet, View } from "react-native";
import { CustomerAppealNavigationProps } from "../../types";
import { size } from "../../common/styles";
import { AppHeader } from "../Layout/AppHeader";
import { TopBackground } from "../Layout/TopBackground";
import { useConfigContext } from "../../context/config";
import { HelpModalContext } from "../../context/help";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { Banner } from "../Layout/Banner";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { KeyboardAvoidingScrollView } from "../Layout/KeyboardAvoidingScrollView";
import {
  ReasonSelectionCard,
  Reason,
} from "./ReasonSelection/ReasonSelectionCard";
import { AuthContext } from "../../context/auth";
import { IdentificationContext } from "../../context/identification";
import { Sentry } from "../../utils/errorTracking";
import { CampaignConfigContext } from "../../context/campaignConfig";
import { useQuota } from "../../hooks/useQuota/useQuota";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { CommonActions, StackActions } from "@react-navigation/native";

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

export const CustomerAppealScreen: FunctionComponent<
  CustomerAppealNavigationProps
> = ({ navigation, route }) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "CustomerAppealScreen",
    });
  }, []);

  const [ids] = useState(route.params?.ids ?? undefined);
  const { policies: allProducts } = useContext(CampaignConfigContext);
  const { selectedIdType } = useContext(IdentificationContext);

  const onCancel = useCallback((): void => {
    // navigateHome(navigation.getParent("RootDrawer"));
    // navigateHome(navigation);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "CollectCustomerDetailsScreen" }],
      })
    );
  }, [navigation]);

  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);

  const { sessionToken, endpoint } = useContext(AuthContext);
  const { allQuotaResponse } = useQuota(ids, sessionToken, endpoint);

  const { i18nt } = useTranslate();
  const getReasons = (): Reason[] => {
    return transform(
      allProducts ?? [],
      (result: Reason[], policy) => {
        if (policy.categoryType === "APPEAL") {
          const policyLimit = policy.quantity.limit;
          const policyThreshold = policy.alert?.threshold;
          const quotaResponse = allQuotaResponse?.remainingQuota.find(
            (quota) =>
              quota.category === policyThreshold ||
              quota.category === policy.category
          );
          let descriptionAlert: string | undefined = undefined;
          if (typeof policyThreshold === "number") {
            if (
              policy.alert &&
              ((quotaResponse &&
                policyLimit - quotaResponse.quantity >= policyThreshold) ||
                /**
                 * Passport user is always charged for token and lost token redemption.
                 *
                 * This special if condition is used to prevent further change to the main policy scheme
                 * since this is a special case
                 */
                (selectedIdType.validation === "PASSPORT" &&
                  policy.category === "tt-token-lost"))
            ) {
              descriptionAlert = policy.alert.label;
            }
            result.push({
              category: policy.category,
              description: policy.name,
              descriptionAlert,
            });
          } else if (typeof policyThreshold === "string") {
            if (
              !(
                selectedIdType.validation === "PASSPORT" &&
                policy.category === "tt-token-lost-waive"
              )
            ) {
              /**
               * Policy threshold is string when its visibility is conditional to other policy that is
               * written on the threshold.
               *
               * Some assumptions that are made:
               * - Policies with dependencies on other policies should be defined after their dependents
               * - Policies with dependencies show up depending on whether its dependent policy's
               *   descriptionAlert is shown
               */
              const dependentReason = result.find(
                (reason) =>
                  reason.descriptionAlert && reason.category === policyThreshold
              );
              if (dependentReason && policy.alert) {
                result.push({
                  category: policy.category,
                  description: policy.name,
                  descriptionAlert: policy.alert.label,
                });
              }
            }
          } else {
            result.push({
              category: policy.category,
              description: policy.name,
              descriptionAlert,
            });
          }
        }
      },
      []
    );
  };

  const onReasonSelection = (productCategory: string): void => {
    const appealProduct = allProducts?.find(
      (policy) =>
        policy.categoryType === "APPEAL" && policy.category === productCategory
    );
    if (appealProduct === undefined) {
      Sentry.captureException(
        `Unable to find appeal product: ${productCategory}}`
      );
      return;
    }
    // pushRoute(navigation, "CustomerQuotaProxy", {
    //   id: ids,
    //   products: [appealProduct],
    // });
    navigation.dispatch(
      StackActions.push("CustomerQuotaProxy", {
        id: ids,
        products: [appealProduct],
      })
    );
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
          reasonSelectionHeader={i18nt(
            "customerAppealScreen",
            "indicateReason"
          )}
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
