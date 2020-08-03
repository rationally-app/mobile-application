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
import { useCart } from "../../hooks/useCart/useCart";

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
  const { getProduct, setProducts, allProducts } = useProductContext();

  // set the product list to appeal products whenever
  // 1. screen newly created
  // 2. user navigate "back" to this screen
  useEffect(() => {
    const resetToAppealProducts = (): void => {
      setProducts(
        allProducts.filter(policy => policy.categoryType === "APPEAL")
      );
    };
    resetToAppealProducts(); // for newly created screen or after end of appeal process
    const focusListender = navigation.addListener("didFocus", () => {
      resetToAppealProducts(); // in case user press "back" all the way from appeal screen after reason selection
    });
    return () => {
      focusListender.remove();
    };
  }, [allProducts, navigation, setProducts]);

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

  // TODO: the useEffect in useCart will cause it to fire to check for quota again....
  const { token, endpoint } = useAuthenticationContext();
  const { cart, emptyCart } = useCart(ids, token, endpoint);

  // TODO: refactor the type once the implementation is reasonable
  const getReasons = (): {
    description: string;
    descriptionAlert: string | undefined;
  }[] => {
    return transform(
      cart,
      (
        result: Array<{
          description: string;
          descriptionAlert: string | undefined;
        }>,
        cartItem
      ) => {
        const cat = cartItem.category;
        const policy = getProduct(cat);
        if (policy) {
          result.push({
            description: policy.name,
            descriptionAlert: cartItem.descriptionAlert
          });
        }
      },
      []
    );
  };

  const onReasonSelection = (
    productName: string,
    descriptionAlert?: string
  ): boolean => {
    const policy = allProducts.find(
      policy => policy.categoryType === "APPEAL" && policy.name === productName
    );
    if (policy === undefined) return false;

    // TODO: do we need to empty the cart?
    // TODO: if we dont empty the cart.. it will contain the original tt-token ItemQuota response
    emptyCart();
    setProducts([policy]);
    pushRoute(navigation, "CustomerQuotaScreen", { id: ids });
    return true;
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
