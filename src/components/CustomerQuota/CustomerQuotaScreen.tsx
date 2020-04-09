import React, {
  FunctionComponent,
  useState,
  Dispatch,
  SetStateAction,
  ReactElement,
} from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NavigationProps } from "../../types";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { color, size, borderRadius, fontSize } from "../../common/styles";
import { postTransaction, Quota, Transaction } from "../../services/quota";
import { useAuthenticationContext } from "../../context/auth";
import { AppName } from "../Layout/AppName";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { useConfigContext } from "../../context/config";
import { Checkbox } from "../Layout/Checkbox";
import { CustomerCard } from "./CustomerCard";
import { useProductContext } from "../../context/products";
import { format, differenceInSeconds, formatDistance } from "date-fns";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(3),
    paddingTop: size(8),
    paddingBottom: size(9),
    height: "100%",
    width: 512,
    maxWidth: "100%",
  },
  headerText: {
    marginBottom: size(2),
  },
  resultWrapper: {
    padding: size(3),
  },
  successfulResultWrapper: {
    backgroundColor: color("green", 10),
    borderColor: color("green", 30),
  },
  failureResultWrapper: {
    paddingBottom: size(4),
    backgroundColor: color("red", 10),
    borderColor: color("red", 30),
  },
  categoryText: {
    fontSize: fontSize(2),
  },
  checkboxesListItem: {
    marginBottom: size(1.5),
  },
  noQuotaCategoryItemWrapper: {
    flexDirection: "row",
    borderRadius: borderRadius(3),
    alignItems: "center",
    minHeight: size(9),
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: color("grey", 20),
  },
  labelWrapper: {
    marginLeft: size(2.5),
    flex: 1,
  },
  noQuotaCategoryItemFeedback: {
    height: size(6),
    backgroundColor: color("yellow", 10),
    borderWidth: 1,
    borderColor: color("yellow", 20),
    borderRadius: borderRadius(3),
    paddingHorizontal: size(1.5),
    marginRight: size(2),
    justifyContent: "center",
  },
  noQuotaCategoryItemFeedbackText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: color("yellow", 50),
    fontSize: fontSize(-2),
    fontFamily: "inter-bold",
  },
  emoji: {
    fontSize: fontSize(3),
    marginBottom: size(2),
    marginTop: size(1),
  },
  statusTitleWrapper: {
    marginBottom: size(2),
  },
  statusTitle: {
    fontSize: fontSize(3),
    lineHeight: 1.3 * fontSize(3),
    fontFamily: "inter-bold",
  },
  purchasedItemsList: {
    marginTop: size(1),
    lineHeight: 1.5 * fontSize(0),
    marginBottom: -size(2),
  },
  purchasedItemText: {
    marginBottom: size(0.5),
  },
  ctaButtonsWrapper: {
    marginTop: size(5),
    paddingBottom: size(10),
  },
  buttonRow: {
    flexDirection: "row",
  },
  submitButton: { flex: 1 },
});

interface CartState {
  [category: string]: boolean | null;
}

const NoQuotaCategoryItem: FunctionComponent<{ label: ReactElement }> = ({
  label,
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
          <AppText style={styles.statusTitleWrapper}>
            <AppText style={styles.statusTitle}>Purchased!</AppText>
          </AppText>
          <View>
            <AppText>Customer purchased the following:</AppText>
            <AppText style={styles.purchasedItemsList}>
              {purchasedItems.map((category) => {
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
            .sort((itemOne, itemTwo) => {
              const productOneOrder = getProduct(itemOne[0])?.order || 0;
              const productTwoOrder = getProduct(itemTwo[0])?.order || 0;

              return productOneOrder - productTwoOrder;
            })
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
                      setCart((cart) => ({
                        ...cart,
                        [category]: !cart[category],
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
                  text: "No",
                },
                {
                  text: "Yes",
                  onPress: onCancel,
                  style: "destructive",
                },
              ]);
            }}
          />
        )}
      </View>
    </View>
  );
};

const DURATION_THRESHOLD_SECONDS = 60 * 10; // 10 minutes
/**
 * Shows when the user cannot purchase anything
 *
 * Precondition: Only rendered when remainingQuota are all 0
 */
const CannotBuyResult: FunctionComponent<{
  nric: string;
  remainingQuota: Transaction[];
  onCancel: () => void;
}> = ({ nric, remainingQuota, onCancel }) => {
  const now = new Date();
  const secondsFromLastTransaction = remainingQuota[0].transactionTime
    ? differenceInSeconds(now, new Date(remainingQuota[0].transactionTime))
    : -1;
  return (
    <View>
      <CustomerCard nric={nric} headerBackgroundColor={color("red", 60)}>
        <View style={[styles.resultWrapper, styles.failureResultWrapper]}>
          <AppText style={styles.emoji}>❌</AppText>
          <AppText style={styles.statusTitleWrapper}>
            {secondsFromLastTransaction > 0 ? (
              secondsFromLastTransaction > DURATION_THRESHOLD_SECONDS ? (
                <>
                  <AppText style={styles.statusTitle}>
                    Limit reached on{" "}
                  </AppText>
                  <AppText style={styles.statusTitle}>
                    {format(
                      remainingQuota[0].transactionTime,
                      "hh:mm a, do MMMM"
                    )}
                    .
                  </AppText>
                </>
              ) : (
                <>
                  <AppText style={styles.statusTitle}>Limit reached </AppText>
                  <AppText style={styles.statusTitle}>
                    {formatDistance(now, remainingQuota[0].transactionTime)}
                  </AppText>
                  <AppText style={styles.statusTitle}> ago.</AppText>
                </>
              )
            ) : (
              <AppText style={styles.statusTitle}>Limit reached.</AppText>
            )}
          </AppText>
        </View>
      </CustomerCard>
      <View style={styles.ctaButtonsWrapper}>
        <DarkButton text="Next customer" onPress={onCancel} fullWidth={true} />
      </View>
    </View>
  );
};

export const CustomerQuotaScreen: FunctionComponent<NavigationProps> = ({
  navigation,
}) => {
  const { getProduct } = useProductContext();
  const { token, endpoint } = useAuthenticationContext();
  const quota: Quota = navigation.getParam("quota");
  const nric: string = navigation.getParam("nric");

  const initialQuantities: CartState = quota.remainingQuota.reduce(
    (state, curr) => {
      const product = getProduct(curr.category);
      const defaultSelectedQuantity = product?.default ?? false;
      state[curr.category] = curr.quantity > 0 ? defaultSelectedQuantity : null;
      return state;
    },
    {} as CartState
  );

  const [cart, setCart] = useState(initialQuantities);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { config } = useConfigContext();

  // TODO: provide the correct date to buy somemore
  const canBuy = quota.remainingQuota.some((val) => val.quantity > 0);

  const onRecordTransaction = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const transactions = Object.entries(cart)
        .filter(([_, quantity]) => quantity)
        .reduce((transactions, [category]) => {
          transactions.push({
            category,
            quantity: quota.remainingQuota.find(
              (line) => line.category === category
            )!.quantity,
          });
          return transactions;
        }, [] as any); // TODO: type this properly

      if (transactions.length === 0) {
        throw new Error("Please tick at least one item to checkout");
      }

      await postTransaction({
        nric,
        key: token,
        transactions,
        endpoint,
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
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      <TopBackground mode={config.appMode} />
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
          <CannotBuyResult
            nric={nric}
            remainingQuota={quota.remainingQuota}
            onCancel={onCancel}
          />
        )}
      </View>
    </ScrollView>
  );
};
