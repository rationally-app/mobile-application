import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { transform } from "lodash";
import { Alert, StyleSheet, View } from "react-native";
import { NavigationProps, Quota } from "../../types";
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
import { ReasonSelectionCard } from "./ReasonSelection/ReasonSelectionCard";
import { pushRoute } from "../../common/navigation";
import { useAuthenticationContext } from "../../context/auth";
import { getQuota } from "../../services/quota";

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

const showAlert = (message: string, onDismiss: () => void): void =>
  Alert.alert("Error", message, [{ text: "OK", onPress: onDismiss }], {
    onDismiss: onDismiss // for android outside alert clicks
  });

export const CustomerAppealScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const [ids, setIds] = useState([navigation.getParam("ids")]);
  const [allQuotaResponse, setAllQuotaResponse] = useState<Quota | null>(null);

  const { setProducts, allProducts } = useProductContext();

  const validateTokenExpiry = useValidateExpiry(navigation.dispatch);
  useEffect(() => {
    validateTokenExpiry();
  }, [validateTokenExpiry]);

  const onCancel = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);

  // TODO: refactor the type once the implementation is reasonable
  const getReasons = (): { description: string; alert: string }[] => {
    return transform(
      allProducts,
      (result: Array<{ description: string; alert: string }>, policy) => {
        if (policy.categoryType === "APPEAL") {
          const maxLimit = policy.quantity.limit;
          const matchedQuota =
            allQuotaResponse?.remainingQuota.find(
              itemQuota => itemQuota.category === policy.category
            )?.quantity ?? maxLimit;
          const expandedQuota = maxLimit - matchedQuota;
          let alertString = "";
          if (policy.thresholdValue && policy.thresholdAlert) {
            alertString =
              expandedQuota > policy.thresholdValue
                ? policy.thresholdAlert
                : "";
          }
          result.push({ description: policy.name, alert: alertString });
        }
      },
      []
    );
  };

  const onReasonSelection = (productName: string): boolean => {
    const policy = allProducts.find(
      policy => policy.categoryType === "APPEAL" && policy.name === productName
    );
    if (policy === undefined) return false;

    setProducts([policy]);
    pushRoute(navigation, "CustomerQuotaScreen", { id: ids });
    return true;
  };

  // TODO: to check for reason alert string
  const { token, endpoint } = useAuthenticationContext();
  useEffect(() => {
    const fetchQuota = async (): Promise<void> => {
      // TODO: add in error handling once implementation is reasonable
      try {
        const allQuotaResponse = await getQuota(ids, token, endpoint);
        setAllQuotaResponse(allQuotaResponse);
      } catch (e) {
        console.warn(e);
      }
    };
    fetchQuota();
  }, [endpoint, ids, token]);

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
          reasonSelectionHeader={"Indicate reason for dispute"}
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
