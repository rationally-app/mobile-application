import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback
} from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { NavigationProps } from "../../types";
import { color, size } from "../../common/styles";
import { postTransaction, Quota, getQuota } from "../../services/quota";
import { useAuthenticationContext } from "../../context/auth";
import { AppName } from "../Layout/AppName";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { useConfigContext } from "../../context/config";
import { useProductContext } from "../../context/products";
import { Card } from "../Layout/Card";
import { ItemsSelectionCard } from "./ItemsSelectionCard";
import { NoQuotaCard } from "./NoQuotaCard";
import { CartState } from "./types";
import { PurchaseSuccessCard } from "./PurchaseSuccessCard";

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
    padding: size(3),
    paddingTop: size(8),
    paddingBottom: size(9),
    height: "100%",
    width: 512,
    maxWidth: "100%"
  },
  headerText: {
    marginBottom: size(2)
  }
});

export const CustomerQuotaScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const { config } = useConfigContext();
  const { getProduct } = useProductContext();
  const { authKey, endpoint } = useAuthenticationContext();
  const nric: string = navigation.getParam("nric");

  const [isCheckingQuota, setIsCheckingQuota] = useState(true);
  const [quota, setQuota] = useState<Quota>();

  const onCancel = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    const onCheck = async (): Promise<void> => {
      try {
        setIsCheckingQuota(true);
        const quotaResponse = await getQuota(nric, authKey, endpoint);
        setQuota(quotaResponse);
        setIsCheckingQuota(false);
      } catch (e) {
        setIsCheckingQuota(false);
        Alert.alert(
          "Error",
          e.message || e,
          [
            {
              text: "Dimiss",
              onPress: onCancel
            }
          ],
          {
            onDismiss: onCancel // for android outside alert clicks
          }
        );
      }
    };
    onCheck();
  }, [authKey, endpoint, nric, onCancel]);

  const [cart, setCart] = useState<CartState>();

  useEffect(() => {
    if (quota) {
      const initialQuantities = quota.remainingQuota.reduce((state, curr) => {
        const product = getProduct(curr.category);
        const defaultSelectedQuantity = product?.default ?? false;
        state[curr.category] =
          curr.quantity > 0 ? defaultSelectedQuantity : null;
        return state;
      }, {} as CartState);
      setCart(initialQuantities);
    }
  }, [getProduct, quota]);

  const [hasPurchased, setHasPurchased] = useState(false);
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);

  // TODO: provide the correct date to buy somemore
  const canBuy = quota?.remainingQuota.some(val => val.quantity > 0) ?? false;

  const onRecordTransaction = async (): Promise<void> => {
    try {
      setIsProcessingTransaction(true);
      const transactions = cart
        ? Object.entries(cart)
            .filter(([_, quantity]) => quantity)
            .reduce((transactions, [category]) => {
              transactions.push({
                category,
                quantity: quota?.remainingQuota.find(
                  line => line.category === category
                )!.quantity
              });
              return transactions;
            }, [] as any) // TODO: type this properly
        : [];

      if (transactions.length === 0) {
        throw new Error("Please tick at least one item to checkout");
      }

      // Use returned data to populate purchased result
      await postTransaction({
        nric,
        key: authKey,
        transactions,
        endpoint
      });
      // TODO: error handling

      setHasPurchased(true);
    } catch (e) {
      Alert.alert("Error", e.message || e);
    } finally {
      setIsProcessingTransaction(false);
    }
  };

  return isCheckingQuota ? (
    <View style={styles.loadingWrapper}>
      <TopBackground style={{ height: "100%", maxHeight: "auto" }} />
      <Card>
        <ActivityIndicator size="large" color={color("grey", 40)} />
        <AppText style={{ marginTop: size(1) }}>Checking...</AppText>
      </Card>
    </View>
  ) : (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      <TopBackground mode={config.appMode} />
      <View style={styles.content}>
        <View style={styles.headerText}>
          <AppName mode={config.appMode} />
        </View>

        {hasPurchased ? (
          <PurchaseSuccessCard
            nric={nric}
            onCancel={onCancel}
            purchasedItems={
              cart
                ? Object.entries(cart)
                    .filter(([_, hasPurchased]) => hasPurchased)
                    .map(([category]) => category)
                : []
            }
          />
        ) : canBuy ? (
          <ItemsSelectionCard
            nric={nric}
            isLoading={isProcessingTransaction}
            onRecordTransaction={onRecordTransaction}
            onCancel={onCancel}
            cart={cart}
            setCart={setCart}
          />
        ) : (
          <NoQuotaCard
            nric={nric}
            remainingQuota={quota?.remainingQuota ?? []}
            onCancel={onCancel}
          />
        )}
      </View>
    </ScrollView>
  );
};
