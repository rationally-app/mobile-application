import React, {
  FunctionComponent,
  useState,
  Dispatch,
  SetStateAction,
  ReactElement
} from "react";
import { View, StyleSheet, SafeAreaView, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NavigationProps } from "../../types";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { color, size, borderRadius, fontSize } from "../../common/styles";
import { postTransaction, Quota } from "../../services/quota";
import { useAuthenticationContext } from "../../context/auth";
import { AppName } from "../Layout/AppName";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { Credits } from "../Credits";
import { useConfigContext } from "../../context/config";
import { Checkbox } from "../Layout/Checkbox";
import { CustomerCard } from "./CustomerCard";
import { useProductContext } from "../../context/products";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(3),
    paddingVertical: size(8),
    height: "100%",
    width: 512,
    maxWidth: "100%"
  },
  headerText: {
    marginBottom: size(3)
  },
  resultWrapper: {
    padding: size(3)
  },
  successfulResultWrapper: {
    backgroundColor: color("green", 10),
    borderColor: color("green", 30)
  },
  failureResultWrapper: {
    paddingBottom: size(4),
    backgroundColor: color("red", 10),
    borderColor: color("red", 30)
  },
  categoryText: {
    fontSize: fontSize(2)
  },
  checkboxesListItem: {
    marginBottom: size(1.5)
  },
  noQuotaCategoryItemWrapper: {
    flexDirection: "row",
    borderRadius: borderRadius(3),
    alignItems: "center",
    minHeight: size(9),
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: color("grey", 20)
  },
  labelWrapper: {
    marginLeft: size(2.5),
    flex: 1
  },
  noQuotaCategoryItemFeedback: {
    height: size(6),
    backgroundColor: color("yellow", 10),
    borderWidth: 1,
    borderColor: color("yellow", 20),
    borderRadius: borderRadius(3),
    paddingHorizontal: size(1.5),
    marginRight: size(2),
    justifyContent: "center"
  },
  noQuotaCategoryItemFeedbackText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: color("yellow", 50),
    fontSize: fontSize(-2),
    fontFamily: "inter-bold"
  },
  emoji: {
    fontSize: fontSize(3),
    marginBottom: size(2),
    marginTop: size(1)
  },
  statusTitle: {
    fontSize: fontSize(3),
    fontFamily: "inter-bold",
    marginBottom: size(2)
  },
  purchasedItemsList: {
    marginTop: size(1),
    lineHeight: 1.5 * fontSize(0),
    marginBottom: -size(2)
  },
  purchasedItemText: {
    marginBottom: size(0.5)
  },
  ctaButtonsWrapper: {
    marginTop: size(5)
  },
  buttonRow: {
    flexDirection: "row"
  },
  submitButton: { flex: 1 }
});

interface CartState {
  [category: string]: boolean | null;
}

const NoQuotaCategoryItem: FunctionComponent<{ label: ReactElement }> = ({
  label
}) => (
  <View style={styles.noQuotaCategoryItemWrapper}>
    <View style={styles.labelWrapper}>{label}</View>
    <View style={styles.noQuotaCategoryItemFeedback}>
      <AppText style={styles.noQuotaCategoryItemFeedbackText}>
        Cannot{"\n"}purchase
      </AppText>
    </View>
  </View>
);

const PurchasedResult: FunctionComponent<{
  nric: string;
  onCancel: () => void;
  purchasedItems: string[];
}> = ({ nric, onCancel, purchasedItems }) => {
  const { getProduct } = useProductContext();
  return (
    <View>
      <CustomerCard nric={nric}>
        <View style={[styles.resultWrapper, styles.successfulResultWrapper]}>
          <AppText style={styles.emoji}>✅</AppText>
          <AppText style={styles.statusTitle}>Purchased!</AppText>
          <View>
            <AppText>Customer purchased the following:</AppText>
            <AppText style={styles.purchasedItemsList}>
              {purchasedItems.map(category => {
                const categoryName = getProduct(category)?.name || category;
                return `• ${categoryName}\n`;
              })}
            </AppText>
          </View>
        </View>
      </CustomerCard>
      <View style={styles.ctaButtonsWrapper}>
        <DarkButton text="Next customer" onPress={onCancel} fullWidth={true} />
      </View>
    </View>
  );
};

const CanBuyResult: FunctionComponent<{
  nric: string;
  isLoading: boolean;
  onRecordTransaction: () => Promise<void>;
  onCancel: () => void;
  cart: CartState;
  setCart: Dispatch<SetStateAction<CartState>>;
}> = ({ nric, isLoading, onRecordTransaction, onCancel, cart, setCart }) => {
  const { getProduct } = useProductContext();
  return (
    <View>
      <CustomerCard nric={nric}>
        <View style={styles.resultWrapper}>
          {Object.entries(cart)
            .sort()
            .map(([category, canBuy]) => {
              const product = getProduct(category);
              const categoryText = product?.name || category;
              return canBuy === null ? (
                <View style={styles.checkboxesListItem} key={category}>
                  <NoQuotaCategoryItem
                    label={
                      <AppText style={styles.categoryText}>
                        {categoryText}
                      </AppText>
                    }
                  />
                </View>
              ) : (
                <View style={styles.checkboxesListItem} key={category}>
                  <Checkbox
                    label={
                      <AppText style={styles.categoryText}>
                        {categoryText}
                      </AppText>
                    }
                    isChecked={canBuy}
                    onToggle={() =>
                      setCart(cart => ({
                        ...cart,
                        [category]: !cart[category]
                      }))
                    }
                  />
                </View>
              );
            })}
        </View>
      </CustomerCard>
      <View style={[styles.ctaButtonsWrapper, styles.buttonRow]}>
        <View
          style={[styles.submitButton, !isLoading && { marginRight: size(2) }]}
        >
          <DarkButton
            text="Checkout"
            icon={
              <Feather
                name="shopping-cart"
                size={size(2)}
                color={color("grey", 0)}
              />
            }
            onPress={onRecordTransaction}
            isLoading={isLoading}
            fullWidth={true}
          />
        </View>
        {!isLoading && (
          <SecondaryButton
            text="Cancel"
            onPress={() => {
              Alert.alert("Cancel transaction?", undefined, [
                {
                  text: "No"
                },
                {
                  text: "Yes",
                  onPress: onCancel,
                  style: "destructive"
                }
              ]);
            }}
          />
        )}
      </View>
    </View>
  );
};

const CannotBuyResult: FunctionComponent<{
  nric: string;
  onCancel: () => void;
}> = ({ nric, onCancel }) => (
  <View>
    <CustomerCard nric={nric} headerBackgroundColor={color("red", 60)}>
      <View style={[styles.resultWrapper, styles.failureResultWrapper]}>
        <AppText style={styles.emoji}>❌</AppText>
        <AppText style={styles.statusTitle}>Customer cannot purchase</AppText>
        <AppText>Customer has already used up their quota.</AppText>
      </View>
    </CustomerCard>
    <View style={styles.ctaButtonsWrapper}>
      <DarkButton text="Next customer" onPress={onCancel} fullWidth={true} />
    </View>
  </View>
);

export const CustomerQuotaScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const { authKey } = useAuthenticationContext();
  const quota: Quota = navigation.getParam("quota");
  const nric: string = navigation.getParam("nric");

  const initialQuantities: CartState = quota.remainingQuota.reduce(
    (state, curr) => {
      state[curr.category] = curr.quantity > 0 ? true : null;
      return state;
    },
    {} as CartState
  );

  const [cart, setCart] = useState(initialQuantities);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { config } = useConfigContext();

  // TODO: provide the correct date to buy somemore
  const canBuy = quota.remainingQuota.some(val => val.quantity > 0);

  const onRecordTransaction = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const transactions = Object.entries(cart)
        .filter(([_, quantity]) => quantity)
        .reduce((transactions, [category]) => {
          transactions.push({
            category,
            quantity: quota.remainingQuota.find(
              line => line.category === category
            )!.quantity
          });
          return transactions;
        }, [] as any); // TODO: type this properly

      if (transactions.length === 0) {
        throw new Error("Please tick at least one item to checkout");
      }

      await postTransaction({
        nric,
        key: authKey,
        transactions,
        mode: config.appMode
      });
      // TODO: error handling

      setHasPurchased(true);
    } catch (e) {
      Alert.alert("Error", e.message || e);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = (): void => {
    navigation.goBack();
  };

  return (
    <View style={{ alignItems: "center" }}>
      <TopBackground mode={config.appMode} />
      <SafeAreaView>
        <View style={styles.content}>
          <View style={styles.headerText}>
            <AppName mode={config.appMode} />
          </View>

          {hasPurchased ? (
            <PurchasedResult
              nric={nric}
              onCancel={onCancel}
              purchasedItems={Object.entries(cart)
                .filter(([_, hasPurchased]) => hasPurchased)
                .map(([category]) => category)}
            />
          ) : canBuy ? (
            <CanBuyResult
              nric={nric}
              isLoading={isLoading}
              onRecordTransaction={onRecordTransaction}
              onCancel={onCancel}
              cart={cart}
              setCart={setCart}
            />
          ) : (
            <CannotBuyResult nric={nric} onCancel={onCancel} />
          )}
        </View>
        <Credits style={{ bottom: size(3) }} />
      </SafeAreaView>
    </View>
  );
};
