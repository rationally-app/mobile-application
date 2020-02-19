import React, {
  FunctionComponent,
  useState,
  Dispatch,
  SetStateAction,
  ReactElement
} from "react";
import { View, StyleSheet, SafeAreaView, Alert } from "react-native";
import { NavigationProps } from "../../types";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { color, size, borderRadius, fontSize } from "../../common/styles";
import { postTransaction, Quota } from "../../services/quota";
import { useAuthenticationContext } from "../../context/auth";
import { AppName } from "../Layout/AppName";
import { Card } from "../Layout/Card";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { Credits } from "../Credits";
import { useConfig } from "../../common/hooks/useConfig";
import { Feather } from "@expo/vector-icons";
import { Checkbox } from "../Layout/Checkbox";

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
  nricText: {
    fontFamily: "inter-bold"
  },
  resultWrapper: {
    marginTop: size(3),
    marginHorizontal: -size(3),
    marginBottom: -size(4),
    paddingHorizontal: size(3),
    paddingVertical: size(4),
    backgroundColor: color("grey", 10),
    borderBottomLeftRadius: borderRadius(4),
    borderBottomRightRadius: borderRadius(4),
    borderWidth: 1,
    borderColor: color("grey", 20)
  },
  successfulResultWrapper: {
    backgroundColor: color("green", 20),
    borderColor: color("green", 30)
  },
  failureResultWrapper: {
    backgroundColor: color("red", 20),
    borderColor: color("red", 30)
  },
  categoryText: {
    fontSize: fontSize(2)
  },
  noQuotaCategoryItemOuterWrapper: {
    paddingHorizontal: size(3)
  },
  noQuotaCategoryItemInnerWrapper: {
    flexDirection: "row",
    paddingVertical: size(2),
    borderBottomColor: color("grey", 20),
    borderBottomWidth: 1
  },
  labelWrapper: {
    flex: 1
  },
  noQuotaCategoryItemFeedback: {
    height: size(6),
    backgroundColor: color("yellow", 10),
    borderWidth: 1,
    borderColor: color("yellow", 20),
    borderRadius: borderRadius(3),
    paddingHorizontal: size(1.5),
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
    marginBottom: size(2)
  },
  statusTitle: {
    fontSize: fontSize(3),
    fontFamily: "inter-bold",
    marginBottom: size(2)
  },
  statusMessage: {
    marginBottom: size(3)
  },
  purchasedItemsList: {
    marginTop: size(1),
    lineHeight: 1.5 * fontSize(0)
  },
  purchasedItemText: {
    marginBottom: size(0.5)
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
  <View style={styles.noQuotaCategoryItemOuterWrapper}>
    <View style={styles.noQuotaCategoryItemInnerWrapper}>
      <View style={styles.labelWrapper}>{label}</View>
      <View style={styles.noQuotaCategoryItemFeedback}>
        <AppText style={styles.noQuotaCategoryItemFeedbackText}>
          Cannot{"\n"}purchase
        </AppText>
      </View>
    </View>
  </View>
);

const PurchasedResult: FunctionComponent<{
  onCancel: () => void;
  purchasedItems: string[];
}> = ({ onCancel, purchasedItems }) => (
  <>
    <AppText style={styles.emoji}>✅</AppText>
    <AppText style={styles.statusTitle}>Purchased!</AppText>
    <View style={styles.statusMessage}>
      <AppText>Customer purchased the following:</AppText>
      <AppText style={styles.purchasedItemsList}>
        {purchasedItems.map(item => `• ${item}\n`)}
      </AppText>
    </View>
    <DarkButton text="Next customer" onPress={onCancel} fullWidth={true} />
  </>
);

const CanBuyResult: FunctionComponent<{
  isLoading: boolean;
  onRecordTransaction: () => Promise<void>;
  onCancel: () => void;
  cart: CartState;
  setCart: Dispatch<SetStateAction<CartState>>;
}> = ({ isLoading, onRecordTransaction, onCancel, cart, setCart }) => (
  <>
    <View
      style={{
        marginHorizontal: -size(3),
        marginTop: -size(2),
        marginBottom: size(5)
      }}
    >
      {Object.entries(cart)
        .sort()
        .map(([category, canBuy]) => {
          return canBuy === null ? (
            <NoQuotaCategoryItem
              key={category}
              label={<AppText style={styles.categoryText}>{category}</AppText>}
            />
          ) : (
            <Checkbox
              key={category}
              label={<AppText style={styles.categoryText}>{category}</AppText>}
              isChecked={canBuy}
              onToggle={() =>
                setCart(cart => ({
                  ...cart,
                  [category]: !cart[category]
                }))
              }
            />
          );
        })}
    </View>
    <View style={styles.buttonRow}>
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
  </>
);

const CannotBuyResult: FunctionComponent<{ onCancel: () => void }> = ({
  onCancel
}) => (
  <>
    <AppText style={styles.emoji}>❌</AppText>
    <AppText style={styles.statusTitle}>Customer cannot purchase</AppText>
    <AppText style={styles.statusMessage}>
      Customer has already used up their quota.
    </AppText>
    <DarkButton text="Next customer" onPress={onCancel} fullWidth={true} />
  </>
);

export const CustomerQuotaScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const { authKey } = useAuthenticationContext();
  const quota: Quota[] = navigation.getParam("quota");
  const nric: string = navigation.getParam("nric");

  const initialQuantities: CartState = quota.reduce(
    (state, { category, remainingQuota }) => {
      state[category] = remainingQuota > 0 ? true : null;
      return state;
    },
    {} as CartState
  );
  const [cart, setCart] = useState(initialQuantities);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { config } = useConfig();

  // TODO: provide the correct date to buy another box of masks
  const canBuy = quota.some(({ remainingQuota }) => remainingQuota > 0);

  const onRecordTransaction = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const transactions = Object.entries(cart)
        .filter(([_, quantity]) => quantity)
        .reduce((transactions, [category]) => {
          transactions.push({
            category,
            quantity: 1
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
          <Card>
            <AppText style={styles.nricText}>Customer NRIC: {nric}</AppText>
            <View
              style={[
                styles.resultWrapper,
                hasPurchased
                  ? styles.successfulResultWrapper
                  : !canBuy && styles.failureResultWrapper
              ]}
            >
              {hasPurchased ? (
                <PurchasedResult
                  onCancel={onCancel}
                  purchasedItems={Object.entries(cart)
                    .filter(([_, hasPurchased]) => hasPurchased)
                    .map(([category]) => category)}
                />
              ) : canBuy ? (
                <CanBuyResult
                  isLoading={isLoading}
                  onRecordTransaction={onRecordTransaction}
                  onCancel={onCancel}
                  cart={cart}
                  setCart={setCart}
                />
              ) : (
                <CannotBuyResult onCancel={onCancel} />
              )}
            </View>
          </Card>
        </View>
        <Credits style={{ bottom: size(3) }} />
      </SafeAreaView>
    </View>
  );
};
